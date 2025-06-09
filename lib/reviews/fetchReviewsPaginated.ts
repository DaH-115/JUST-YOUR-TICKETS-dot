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
import { SerializableUser } from "store/redux-toolkit/slice/userSlice";
import formatDate from "app/utils/formatDate";

// UI에게 반환할, 문자열로 변환된 타입
export interface ReviewDoc {
  id: string;
  user: SerializableUser;
  review: {
    movieId: number;
    movieTitle: string;
    originalTitle: string;
    moviePosterPath?: string;
    releaseYear: string;
    rating: number;
    reviewTitle: string;
    reviewContent: string;
    createdAt: string; // ISO 문자열
    updatedAt: string;
    likeCount: number;
  };
}

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
}: FetchReviewsParams): Promise<{ reviews: ReviewDoc[]; totalPages: number }> {
  // 1) 컬렉션, 필터
  let base = collection(db, "movie-reviews") as Query<DocumentData>;
  if (uid) base = query(base, where("user.uid", "==", uid));

  // 2) countQuery 구성 (검색 포함)
  let countQuery = base;
  if (search) {
    const end = search + "\uf8ff";
    countQuery = query(
      countQuery,
      where("review.movieTitle", ">=", search),
      where("review.movieTitle", "<=", end),
    );
  }
  const countSnap = await getCountFromServer(countQuery);
  const totalPages = Math.ceil(countSnap.data().count / pageSize);

  // 3) docsQuery 구성
  let docsQuery: Query<DocumentData>;

  if (search) {
    // 검색어가 있을 때는 movieTitle로 먼저 정렬 (범위 쿼리 제약사항)
    docsQuery = query(
      base,
      where("review.movieTitle", ">=", search),
      where("review.movieTitle", "<=", search + "\uf8ff"),
      orderBy("review.movieTitle", "asc"),
      orderBy("review.createdAt", "desc"),
      limit(page * pageSize),
    );
  } else {
    // 검색어가 없을 때는 createdAt로만 정렬
    docsQuery = query(
      base,
      orderBy("review.createdAt", "desc"),
      limit(page * pageSize),
    );
  }

  // 4) 데이터 변환
  const snap = await getDocs(docsQuery);

  const all: ReviewDoc[] = snap.docs.map((doc) => {
    const d = doc.data();
    const createdIso = d.review.createdAt.toDate().toISOString();
    const updatedIso = d.review.updatedAt.toDate().toISOString();

    return {
      id: doc.id,
      user: d.user,
      review: {
        ...d.review,
        createdAt: formatDate(createdIso),
        updatedAt: formatDate(updatedIso),
      },
    };
  });

  // 5) 페이지 슬라이스
  const start = (page - 1) * pageSize;
  return {
    reviews: all.slice(start, start + pageSize),
    totalPages,
  };
}
