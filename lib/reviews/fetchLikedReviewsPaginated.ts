import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Query,
  where,
} from "firebase/firestore";
import { db } from "firebase-config";
import fetchReviewById from "lib/reviews/fetchReviewById";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import formatDate from "app/utils/formatDate";

interface FetchLikedParams {
  uid: string;
  page: number;
  pageSize: number;
  search?: string;
}

interface PaginatedResult {
  reviews: ReviewDoc[];
  totalPages: number;
}

export async function fetchLikedReviewsPaginated({
  uid,
  page,
  pageSize,
  search = "",
}: FetchLikedParams): Promise<PaginatedResult> {
  const base = collection(db, "users", uid, "liked-reviews");

  // 1) 검색어 유무에 따른 count 쿼리
  let countQuery: Query = base;
  if (search) {
    const end = search + "\uf8ff";
    countQuery = query(
      base,
      where("movieTitle", ">=", search),
      where("movieTitle", "<=", end),
    );
  }

  // 2) 총 개수 및 페이지 수 계산
  const countSnap = await getCountFromServer(countQuery);
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 3) 실제 페이지 문서 가져오기
  const pagedQuery = query(
    countQuery,
    orderBy("likedAt", "desc"),
    limit(page * pageSize),
  );
  const snap = await getDocs(pagedQuery);

  // 4) 슬라이스로 한 페이지만 추출
  const allItems = snap.docs.map((doc) => ({
    id: doc.id,
    likedAt: formatDate(doc.data().likedAt), // ISO 변환 유틸 적용
  }));
  const start = (page - 1) * pageSize;
  const pageItems = allItems.slice(start, start + pageSize);

  // 5) 상세 리뷰 fetch
  const detailed = await Promise.all(
    pageItems.map(({ id }) => fetchReviewById(id)),
  );
  const reviews: ReviewDoc[] = detailed.filter((r): r is ReviewDoc => !!r);

  return { reviews, totalPages };
}
