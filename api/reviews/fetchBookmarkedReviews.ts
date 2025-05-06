import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  Query,
} from "firebase/firestore";
import { db } from "firebase-config";

interface PaginatedItems {
  reviews: { id: string; bookmarkedAt: string }[];
  totalPages: number;
}

/** Firestore 타임스탬프 변환 유틸 */
const convertTsToIso = (ts: any) =>
  ts?.seconds ? new Date(ts.seconds * 1000).toISOString() : "";

export async function fetchBookmarkedReviewsPaginated(
  uid: string,
  page: number,
  pageSize: number,
): Promise<PaginatedItems> {
  const colRef = collection(db, "users", uid, "bookmarked-reviews");

  // 1) 총 개수
  const countSnap = await getCountFromServer(colRef);
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 2) 최대 조회
  const q: Query = query(
    colRef,
    orderBy("bookmarkedAt", "desc"),
    limit(page * pageSize),
  );
  const snap = await getDocs(q);

  // 3) 슬라이스
  const skip = (page - 1) * pageSize;
  const all = snap.docs.map((doc) => ({
    id: doc.id,
    bookmarkedAt: convertTsToIso(doc.data().bookmarkedAt),
  }));
  const reviews = all.slice(skip, skip + pageSize);

  return { reviews, totalPages };
}
