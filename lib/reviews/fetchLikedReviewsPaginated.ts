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

  // 2. 검색어 유무에 따른 카운트 쿼리
  let countQuery: Query<DocumentData> = baseRef;

  if (search) {
    const end = search + "\uf8ff";
    // "movieTitle" 필드가 'search'로 시작하는 리뷰들을 필터링
    countQuery = query(
      baseRef,
      where("movieTitle", ">=", search),
      where("movieTitle", "<=", end),
    );
  }

  // 3. 총 개수 및 페이지 수 계산
  const countSnap = await getCountFromServer(countQuery); // 쿼리 결과의 문서 개수를 서버 사이드에서 세어주는 함수
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 4. 페이징해서 liked-reviews 문서 가져오기
  const pagedQuery = query(
    countQuery,
    orderBy("likedAt", "desc"),
    limit(page * pageSize),
  );
  const snap = await getDocs(pagedQuery);

  // 5) liked-reviews 문서에서 ID 리스트만 뽑은 뒤, "fetchReviewById" 호출
  //    (fetchReviewById에서 Timestamp → string 변환을 해 줌)
  const likedReviews = await Promise.all(
    snap.docs.map(async (docSnap) => {
      const reviewId = docSnap.id;
      const reviewDoc = await fetchReviewById({ reviewId, uid });
      return reviewDoc;
    }),
  );

  // 6) null 제거
  const reviews = likedReviews.filter((review) => review !== null);

  // 7) 가져온 데이터 페이지 슬라이스 (필요한 만큼 슬라이스 적용)
  const start = (page - 1) * pageSize;
  const pagedReviews = reviews.slice(start, start + pageSize);

  return {
    reviews: pagedReviews,
    totalPages,
  };
}
