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
import { Review } from "lib/reviews/fetchReviews";

/** Firestore 타임스탬프 → ISO 문자열 변환 유틸 */
const convertTsToIso = (ts: any) =>
  ts?.seconds ? new Date(ts.seconds * 1000).toISOString() : "";

interface FetchLikedParams {
  uid: string;
  page: number;
  pageSize: number;
  /** 검색어 (reviewTitle 또는 movieTitle) */
  search?: string;
}

interface PaginatedResult {
  reviews: Review[];
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
  // 커서 기반 페이지네이션 예 (page > 1일 때)
  const pagedQuery = query(
    countQuery,
    orderBy("likedAt", "desc"),
    limit(page * pageSize),
  );
  const snap = await getDocs(pagedQuery);

  // 4) 슬라이스로 한 페이지만 추출
  const allItems = snap.docs.map((doc) => ({
    id: doc.id,
    likedAt: convertTsToIso(doc.data().likedAt), // ISO 변환 유틸 적용
  }));
  const start = (page - 1) * pageSize;
  const pageItems = allItems.slice(start, start + pageSize);

  // 5) 상세 리뷰 fetch
  const detailed = await Promise.all(
    pageItems.map(({ id }) => fetchReviewById(id)),
  );
  const reviews: Review[] = detailed.filter((r): r is Review => !!r);

  return { reviews, totalPages };
}
