import { adminFirestore } from "firebase-admin-config";
import { ReviewDoc, ReviewUser } from "lib/reviews/fetchReviewsPaginated";

interface FetchLikedReviewsParams {
  page: number;
  pageSize: number;
  uid: string;
  search?: string;
}

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
    // 1) 컬렉션 그룹 쿼리로 사용자가 좋아요한 리뷰 ID 목록 조회
    const likesQuery = adminFirestore
      .collectionGroup("likedBy")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc");

    const likesSnapshot = await likesQuery.get();
    const likedReviewIds = likesSnapshot.docs.map(
      (doc) => doc.ref.parent.parent!.id,
    );

    if (likedReviewIds.length === 0) {
      return { reviews: [], totalPages: 0, totalCount: 0 };
    }

    // 2) 리뷰 데이터 조회 (검색어 필터링 포함)
    let reviewsQuery = adminFirestore
      .collection("movie-reviews")
      .where("__name__", "in", likedReviewIds);

    // 검색어가 있으면 쿼리 결과를 클라이언트 측에서 필터링해야 함
    // Firestore는 동일 필드에 대한 범위/부등식 쿼리와 다른 필드에 대한 쿼리를 동시에 지원하지 않기 때문

    const reviewsSnapshot = await reviewsQuery.get();
    let reviewsData = reviewsSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as any,
    );

    // 3) 검색어 필터링 (클라이언트 사이드)
    if (search) {
      const searchTerm = search.toLowerCase();
      reviewsData = reviewsData.filter(
        (data) =>
          data.review.movieTitle.toLowerCase().includes(searchTerm) ||
          data.review.reviewTitle.toLowerCase().includes(searchTerm) ||
          data.review.reviewContent.toLowerCase().includes(searchTerm),
      );
    }

    const totalCount = reviewsData.length;

    // 4) 시간순 정렬 및 페이지네이션 (클라이언트 사이드) -> DB에서 정렬하므로 제거
    // reviewsData.sort(
    //   (a, b) => b.review.createdAt.toMillis() - a.review.createdAt.toMillis(),
    // );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedReviewData = reviewsData.slice(start, end);

    // 5) 필요한 사용자 정보 일괄 조회
    const userIds = [
      ...new Set(paginatedReviewData.map((review) => review.user.uid)),
    ];
    const usersMap = new Map<string, ReviewUser>();

    if (userIds.length > 0) {
      const userDocs = await adminFirestore
        .collection("users")
        .where("__name__", "in", userIds)
        .get();
      userDocs.forEach((doc) => {
        const userData = doc.data();
        usersMap.set(doc.id, {
          uid: doc.id,
          displayName: userData.displayName,
          photoKey: userData.photoKey,
          activityLevel: userData.activityLevel || "NEWBIE",
        });
      });
    }

    // 6) 최종 데이터 조합
    const reviews: ReviewDoc[] = paginatedReviewData
      .map((data) => {
        const user = usersMap.get(data.user.uid);
        if (!user) return null;

        return {
          id: data.id,
          user,
          review: {
            ...data.review,
            createdAt: data.review.createdAt.toDate().toISOString(),
            updatedAt: data.review.updatedAt.toDate().toISOString(),
          },
        };
      })
      .filter((review): review is ReviewDoc => review !== null);

    return {
      reviews,
      totalPages: Math.ceil(totalCount / pageSize),
      totalCount,
    };
  } catch (error) {
    console.error("좋아요한 리뷰 조회 실패:", error);
    throw new Error("좋아요한 리뷰 조회에 실패했습니다.");
  }
}
