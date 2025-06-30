import { adminFirestore } from "firebase-admin-config";
import type { Query, DocumentData } from "firebase-admin/firestore";
import { SerializableUser } from "store/redux-toolkit/slice/userSlice";

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
  // 1) 기본 컬렉션 참조
  const baseCollection = adminFirestore.collection("movie-reviews");

  // 2) 쿼리 구성
  let query: Query<DocumentData> = baseCollection;

  // 사용자 필터 적용
  if (uid) {
    query = query.where("user.uid", "==", uid);
  }

  // 검색어가 있는 경우 필터 추가
  if (search) {
    const end = search + "\uf8ff";
    query = query
      .where("review.movieTitle", ">=", search)
      .where("review.movieTitle", "<=", end);
  }

  // 3) 전체 개수 조회
  const countSnapshot = await query.count().get();
  const totalPages = Math.ceil(countSnapshot.data().count / pageSize);

  // 4) 데이터 조회 쿼리 구성
  let docsQuery: Query<DocumentData> = query;

  if (search) {
    // 검색어가 있을 때는 movieTitle로 먼저 정렬 (범위 쿼리 제약사항)
    docsQuery = docsQuery
      .orderBy("review.movieTitle", "asc")
      .orderBy("review.createdAt", "desc")
      .limit(page * pageSize);
  } else {
    // 검색어가 없을 때는 createdAt로만 정렬
    docsQuery = docsQuery
      .orderBy("review.createdAt", "desc")
      .limit(page * pageSize);
  }

  // 5) 데이터 조회
  const snapshot = await docsQuery.get();

  // 6) 데이터 변환 및 사용자 등급 정보 추가
  const all: ReviewDoc[] = await Promise.all(
    snapshot.docs.map(async (doc) => {
      const data = doc.data();
      const createdIso = data.review.createdAt.toDate().toISOString();
      const updatedIso = data.review.updatedAt.toDate().toISOString();

      // 사용자의 activityLevel 조회
      let userActivityLevel = "NEWBIE"; // 기본값
      try {
        const userRef = adminFirestore.collection("users").doc(data.user.uid);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
          const userData = userSnap.data();
          userActivityLevel = userData?.activityLevel || "NEWBIE";
        }
      } catch (error) {
        console.warn(`사용자 ${data.user.uid}의 등급 조회 실패:`, error);
      }

      return {
        id: doc.id,
        user: {
          ...data.user,
          activityLevel: userActivityLevel,
        },
        review: {
          ...data.review,
          createdAt: createdIso,
          updatedAt: updatedIso,
        },
      };
    }),
  );

  // 7) 페이지 슬라이스
  const start = (page - 1) * pageSize;
  return {
    reviews: all.slice(start, start + pageSize),
    totalPages,
  };
}
