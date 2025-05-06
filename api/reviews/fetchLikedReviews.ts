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
  reviews: { id: string; likedAt: string }[];
  totalPages: number;
}

/** Firestore 타임스탬프 변환 유틸 */
const convertTsToIso = (ts: any) =>
  ts?.seconds ? new Date(ts.seconds * 1000).toISOString() : "";

export async function fetchLikedReviewsPaginated(
  uid: string,
  page: number,
  pageSize: number,
): Promise<PaginatedItems> {
  const colRef = collection(db, "users", uid, "liked-reviews");

  // 1) 총 개수 조회
  const countSnap = await getCountFromServer(colRef);
  const totalCount = countSnap.data().count;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 2) 문서 최대 page * pageSize 만큼 조회
  const q: Query = query(
    colRef,
    orderBy("likedAt", "desc"),
    limit(page * pageSize),
  );
  const snap = await getDocs(q);

  // 3) 슬라이스로 해당 페이지 아이템만 추출
  const skip = (page - 1) * pageSize;
  const all = snap.docs.map((doc) => ({
    id: doc.id,
    likedAt: convertTsToIso(doc.data().likedAt),
  }));
  const reviews = all.slice(skip, skip + pageSize);

  return { reviews, totalPages };
}
