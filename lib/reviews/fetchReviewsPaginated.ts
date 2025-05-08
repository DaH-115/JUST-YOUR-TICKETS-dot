import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "firebase-config";
import type { Review } from "lib/reviews/fetchReviews";

export interface PaginatedReviews {
  reviews: Review[];
  totalPages: number;
}

/**
 * 페이지네이션과 전체 리뷰 개수를 함께 조회합니다.
 * @param uid 리뷰 작성자 UID (생략 가능)
 * @param page 조회할 페이지 번호 (1부터 시작)
 * @param pageSize 한 페이지당 아이템 개수
 */
export async function fetchReviewsPaginated({
  uid,
  page,
  pageSize,
}: {
  uid?: string;
  page: number;
  pageSize: number;
}): Promise<PaginatedReviews> {
  // 1) base 컬렉션
  const baseCol = collection(db, "movie-reviews");

  // 2) uid 필터링된 쿼리 혹은 전체 쿼리
  const filteredCol = uid ? query(baseCol, where("uid", "==", uid)) : baseCol;

  // 3) 총 개수 조회
  const countSnap = await getCountFromServer(
    typeof filteredCol === "object" // query 객체인지 확인
      ? filteredCol
      : query(filteredCol),
  );
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 4) 문서 조회 (페이지 * 페이지사이즈 만큼 가져온 뒤 slice)
  const skip = (page - 1) * pageSize;
  const q = query(
    // filteredCol이 query 객체면 spread, 아니면 그냥 컬렉션
    typeof filteredCol === "object" ? filteredCol : query(filteredCol),
    orderBy("createdAt", "desc"),
    limit(page * pageSize),
  );
  const snap = await getDocs(q);

  const all = snap.docs.map((doc) => {
    const data: any = doc.data();
    return {
      id: doc.id,
      uid: data.uid,
      userName: data.userName,
      movieId: data.movieId,
      movieTitle: data.movieTitle,
      moviePosterPath: data.moviePosterPath,
      releaseYear: data.releaseYear,
      rating: data.rating,
      reviewTitle: data.reviewTitle,
      reviewContent: data.reviewContent,
      likeCount: data.likeCount,
      createdAt: data.createdAt.toDate().toISOString(),
    } as Review;
  });

  // 5) 페이지 범위만 잘라서 반환
  const reviews = all.slice(skip, skip + pageSize);
  return { reviews, totalPages };
}
