import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Query,
  CollectionReference,
} from "firebase/firestore";
import { db } from "firebase-config";
import { Review } from "lib/reviews/fetchReviews";

interface FetchReviewsParams {
  page: number;
  pageSize: number;
  uid?: string;
  search?: string;
}

export async function fetchReviewsPaginated({
  page,
  pageSize,
  uid,
  search = "",
}: FetchReviewsParams): Promise<{ reviews: Review[]; totalPages: number }> {
  // 1) 기본 컬렉션 또는 특정 유저 필터
  let base: CollectionReference | Query = collection(db, "movie-reviews");
  if (uid) {
    base = query(base, where("uid", "==", uid));
  }

  // 2) 검색어가 있으면 movieTitle prefix 필터를 적용
  let countQuery = base as Query;
  if (search) {
    const end = search + "\uf8ff";
    countQuery = query(
      countQuery,
      where("movieTitle", ">=", search),
      where("movieTitle", "<=", end),
    );
  }

  // 3) 전체 개수 조회 → totalPages 계산
  const countSnap = await getCountFromServer(countQuery);
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 4) 문서 가져올 쿼리 구성
  let docsQuery: Query;
  if (search) {
    const end = search + "\uf8ff";
    docsQuery = query(
      base as Query,
      where("movieTitle", ">=", search),
      where("movieTitle", "<=", end),
      limit(page * pageSize), // page * pageSize 개까지 미리 불러오기
    );
  } else {
    docsQuery = query(
      base as Query,
      orderBy("createdAt", "desc"), // 생성일 내림차순
      limit(page * pageSize),
    );
  }

  // 5) 스냅샷 가져와 매핑
  const snap = await getDocs(docsQuery);
  const all = snap.docs.map((doc) => {
    const d: any = doc.data();
    return {
      id: doc.id,
      uid: d.uid,
      userName: d.userName,
      movieId: d.movieId,
      movieTitle: d.movieTitle,
      moviePosterPath: d.moviePosterPath,
      releaseYear: d.releaseYear,
      rating: d.rating,
      reviewTitle: d.reviewTitle,
      reviewContent: d.reviewContent,
      likeCount: d.likeCount,
      createdAt: d.createdAt.toDate().toISOString(),
    } as Review;
  });

  // 6) JS에서 최종 정렬(최신순) 후 해당 페이지 슬라이스
  const sorted = all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const start = (page - 1) * pageSize;
  const reviews = sorted.slice(start, start + pageSize);

  return { reviews, totalPages };
}
