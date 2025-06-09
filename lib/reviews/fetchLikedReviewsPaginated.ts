import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "firebase-config";
import fetchReviewById from "lib/reviews/fetchReviewById";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface FetchLikedParams {
  uid: string;
  page: number;
  pageSize: number;
  search?: string;
}

// 1) liked-reviews 컬렉션 참조: 사용자가 '좋아요'한 리뷰의 ID 목록을 가져온다
// 2) 쿼리 결과를 페이지네이션: page × pageSize 개수만큼 먼저 뽑고,
//    JS slice로 실제 그 페이지 구간만 잘라서 반환
// 3) 잘라낸 ID 목록으로 "fetchReviewById" 호출 → 상세 리뷰 가져온 뒤 Timestamp를 문자열로 변환
// 4) 최종 ReviewDoc[] 형태로 반환

export async function fetchLikedReviewsPaginated({
  uid,
  page,
  pageSize,
  search = "",
}: FetchLikedParams): Promise<{ reviews: ReviewDoc[]; totalPages: number }> {
  // 1. uid 하위 liked-reviews 컬렉션 참조
  // /users/{uid}/liked-reviews
  const baseRef = collection(db, "users", uid, "liked-reviews");

  // 2. 검색어 유무에 따른 쿼리 구성
  let countQuery: Query<DocumentData> = baseRef;

  if (search) {
    const end = search + "\uf8ff";
    countQuery = query(
      baseRef,
      where("movieTitle", ">=", search),
      where("movieTitle", "<=", end),
    );
  }

  // 3. 총 개수 및 페이지 수 계산
  const countSnap = await getCountFromServer(countQuery);
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 4. 페이징 쿼리
  let pagedQuery: Query<DocumentData>;

  if (search) {
    // 검색어가 있을 때는 movieTitle로 먼저 정렬
    pagedQuery = query(
      countQuery,
      orderBy("movieTitle", "asc"),
      orderBy("likedAt", "desc"),
      limit(page * pageSize),
    );
  } else {
    // 검색어가 없을 때는 likedAt로만 정렬
    pagedQuery = query(
      countQuery,
      orderBy("likedAt", "desc"),
      limit(page * pageSize),
    );
  }

  const snap = await getDocs(pagedQuery);

  // 5. 리뷰 상세 정보 가져오기
  const likedReviews = await Promise.all(
    snap.docs.map(async (docSnap) => {
      const reviewId = docSnap.id;
      const reviewDoc = await fetchReviewById({ reviewId, uid });
      return reviewDoc;
    }),
  );

  // 6. null 제거
  const reviews = likedReviews.filter((review) => review !== null);

  // 7. 페이지 슬라이스
  const start = (page - 1) * pageSize;
  const pagedReviews = reviews.slice(start, start + pageSize);

  return {
    reviews: pagedReviews,
    totalPages,
  };
}
