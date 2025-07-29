import { Timestamp } from "firebase-admin/firestore";
import { adminFirestore } from "firebase-admin-config";
import { ReviewDoc, ReviewUser } from "lib/reviews/fetchReviewsPaginated";

// 함수 파라미터 타입
interface FetchLikedReviewsParams {
  page: number;
  pageSize: number;
  uid: string;
  search?: string;
}

// Firestore에서 가져온 원본 리뷰 데이터 (날짜는 Timestamp)
interface RawReview {
  id: string;
  user: ReviewUser;
  likeCount?: number; // 최상위 레벨 likeCount (API 업데이트 후)
  review: {
    movieId: number;
    movieTitle: string;
    originalTitle: string;
    moviePosterPath?: string;
    releaseYear: string;
    rating: number;
    reviewTitle: string;
    reviewContent: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    likeCount: number;
  };
}

// 설정값
const MAX_REVIEWS_PER_QUERY = 10; // Firestore 제한: in 쿼리는 한번에 10개까지만

/**
 * 사용자가 좋아요한 리뷰 목록을 페이지 단위로 가져오는 함수
 *
 * 과정:
 * 1. 사용자가 좋아요한 리뷰 ID들 찾기
 * 2. 해당 리뷰들의 상세 정보 가져오기
 * 3. 검색어로 필터링 (있다면)
 * 4. 페이지네이션 적용
 * 5. 사용자 정보 추가
 */
export async function fetchLikedReviewsPaginated({
  page,
  pageSize,
  uid,
  search = "",
}: FetchLikedReviewsParams): Promise<{
  reviews: ReviewDoc[];
  totalPages: number;
  totalCount: number;
}> {
  try {
    // 1단계: 사용자가 좋아요한 리뷰 ID들 찾기
    const likedReviewIds = await getLikedReviewIds(uid);
    console.log(
      `🔍 [fetchLikedReviewsPaginated] 사용자 ${uid}가 좋아요한 리뷰 ID 개수:`,
      likedReviewIds.length,
    );

    if (likedReviewIds.length === 0) {
      return { reviews: [], totalPages: 0, totalCount: 0 };
    }

    // 2단계: 리뷰 상세 정보 가져오기 (Firestore 제한 고려)
    const allReviews = await getReviewsByIds(likedReviewIds);
    console.log(
      `📄 [fetchLikedReviewsPaginated] 실제 가져온 리뷰 개수:`,
      allReviews.length,
    );
    console.log(
      `❌ [fetchLikedReviewsPaginated] 누락된 리뷰 개수:`,
      likedReviewIds.length - allReviews.length,
    );

    // 3단계: 검색어로 필터링 (검색어가 있다면)
    const filteredReviews = search
      ? filterReviewsBySearch(allReviews, search)
      : allReviews;

    // 4단계: 페이지네이션 적용
    const { paginatedReviews, totalPages, totalCount } = paginateReviews(
      filteredReviews,
      page,
      pageSize,
    );

    // 5단계: 사용자 정보 추가하고 최종 형태로 변환
    const finalReviews = await addUserInfoToReviews(paginatedReviews);

    return {
      reviews: finalReviews,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error("좋아요한 리뷰 조회 실패:", error);
    throw new Error("좋아요한 리뷰 조회에 실패했습니다.");
  }
}

/**
 * 1단계: 사용자가 좋아요한 리뷰 ID들 찾기
 * 컬렉션 그룹 쿼리를 사용해서 모든 리뷰의 좋아요 정보에서 해당 사용자 찾기
 */
async function getLikedReviewIds(uid: string): Promise<string[]> {
  const likesQuery = adminFirestore
    .collectionGroup("likedBy")
    .where("uid", "==", uid)
    .orderBy("createdAt", "desc");

  const likesSnapshot = await likesQuery.get();

  // 좋아요 문서의 부모의 부모가 리뷰 문서 (likedBy -> 리뷰ID -> movie-reviews)
  return likesSnapshot.docs.map((doc) => doc.ref.parent.parent!.id);
}

/**
 * 2단계: 리뷰 ID들로 실제 리뷰 데이터 가져오기
 * Firestore 제한: in 쿼리는 한번에 10개까지만 가능해서 나누어서 조회
 */
async function getReviewsByIds(reviewIds: string[]): Promise<RawReview[]> {
  // 빈 배열이면 바로 리턴
  if (reviewIds.length === 0) return [];

  // 10개씩 나누어서 처리
  const reviewGroups = splitIntoGroups(reviewIds, MAX_REVIEWS_PER_QUERY);

  // 각 그룹별로 병렬 조회
  const promises = reviewGroups.map((group) =>
    adminFirestore
      .collection("movie-reviews")
      .where("__name__", "in", group)
      .get(),
  );

  const snapshots = await Promise.all(promises);

  // 모든 결과를 하나로 합치기
  const allReviews: RawReview[] = [];
  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((doc) => {
      allReviews.push({ id: doc.id, ...doc.data() } as RawReview);
    });
  });

  return allReviews;
}

/**
 * 3단계: 검색어로 리뷰 필터링
 * 영화 제목, 리뷰 제목, 리뷰 내용에서 검색
 */
function filterReviewsBySearch(
  reviews: RawReview[],
  search: string,
): RawReview[] {
  const searchTerm = search.toLowerCase().trim();

  return reviews.filter((review) => {
    const movieTitle = review.review.movieTitle.toLowerCase();
    const reviewTitle = review.review.reviewTitle.toLowerCase();
    const reviewContent = review.review.reviewContent.toLowerCase();

    return (
      movieTitle.includes(searchTerm) ||
      reviewTitle.includes(searchTerm) ||
      reviewContent.includes(searchTerm)
    );
  });
}

/**
 * 4단계: 리뷰 목록을 페이지 단위로 자르기
 */
function paginateReviews(
  reviews: RawReview[],
  page: number,
  pageSize: number,
): {
  paginatedReviews: RawReview[];
  totalPages: number;
  totalCount: number;
} {
  const totalCount = reviews.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReviews = reviews.slice(startIndex, endIndex);

  return { paginatedReviews, totalPages, totalCount };
}

/**
 * 배열을 지정된 크기의 작은 그룹들로 나누기
 * 예: [1,2,3,4,5,6], 크기 2 → [[1,2], [3,4], [5,6]]
 */
function splitIntoGroups<T>(array: T[], groupSize: number): T[][] {
  const groups: T[][] = [];

  for (let i = 0; i < array.length; i += groupSize) {
    const group = array.slice(i, i + groupSize);
    groups.push(group);
  }

  return groups;
}

/**
 * 5단계: 사용자 정보를 가져와서 리뷰에 추가하고 최종 형태로 변환
 */
async function addUserInfoToReviews(
  reviews: RawReview[],
): Promise<ReviewDoc[]> {
  if (reviews.length === 0) return [];

  // 사용자 ID들 추출 (중복 제거, null 제외)
  const userIds = [
    ...new Set(
      reviews
        .map((review) => review.user.uid)
        .filter((uid): uid is string => Boolean(uid)),
    ),
  ];

  // 사용자 정보 저장용 맵
  const usersMap = new Map<string, ReviewUser>();

  // 사용자 정보 가져오기
  if (userIds.length > 0) {
    try {
      // 사용자도 10개씩 나누어서 조회 (Firestore 제한)
      const userGroups = splitIntoGroups(userIds, MAX_REVIEWS_PER_QUERY);

      const promises = userGroups.map((group) =>
        adminFirestore.collection("users").where("__name__", "in", group).get(),
      );

      const snapshots = await Promise.all(promises);

      // 결과 합치기
      snapshots.forEach((snapshot) => {
        snapshot.forEach((doc) => {
          const userData = doc.data();
          usersMap.set(doc.id, {
            uid: doc.id,
            displayName: userData.displayName || null,
            photoKey: userData.photoKey || null,
            activityLevel: userData.activityLevel || "NEWBIE",
          });
        });
      });
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      // 실패해도 계속 진행 (사용자 정보 없이라도 리뷰는 보여줌)
    }
  }

  // 최종 데이터 만들기 (null 처리 포함)
  const finalReviews: ReviewDoc[] = [];

  for (const review of reviews) {
    // 사용자 정보가 없는 리뷰는 제외
    if (!review.user.uid) continue;

    // 사용자 정보 찾기
    const user = usersMap.get(review.user.uid);
    if (!user) continue; // 사용자 정보를 찾을 수 없으면 제외

    // 최종 리뷰 데이터 추가 (날짜를 문자열로 변환)
    finalReviews.push({
      id: review.id,
      user,
      review: {
        ...review.review,
        // 최상위 likeCount를 review 안에 복사 (API 업데이트와 호환성 유지)
        likeCount: review.likeCount || review.review.likeCount || 0,
        isLiked: true, // 좋아요한 리뷰 목록이므로 항상 true
        createdAt: review.review.createdAt.toDate().toISOString(),
        updatedAt: review.review.updatedAt.toDate().toISOString(),
      },
    });
  }

  return finalReviews;
}
