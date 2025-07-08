import { adminFirestore } from "firebase-admin-config";
import type { Query, DocumentData } from "firebase-admin/firestore";

export interface ReviewUser {
  uid: string | null;
  displayName: string | null;
  photoKey: string | null;
  activityLevel?: string; // 등급 정보는 UI 표시용으로 포함
}

// UI에게 반환할, 문자열로 변환된 타입
export interface ReviewDoc {
  id: string;
  user: ReviewUser;
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
  try {
    // 1) 기본 쿼리 생성
    let query: Query<DocumentData> = adminFirestore
      .collection("movie-reviews")
      .orderBy("review.createdAt", "desc");

    // 2) 사용자별 필터링
    if (uid) {
      query = query.where("user.uid", "==", uid);
    }

    // 3) 검색 필터링 (영화 제목, 리뷰 제목, 리뷰 내용에 대한 검색)
    if (search) {
      // Firestore에서는 복잡한 텍스트 검색이 제한적이므로 클라이언트에서 필터링
    }

    // 4) 전체 개수 가져오기 (페이지네이션을 위해)
    const countSnapshot = await query.count().get();
    const totalCount = countSnapshot.data().count;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 5) 실제 데이터 가져오기
    const snapshot = await query.get();

    // 6) 데이터 변환 및 사용자 등급 정보 추가
    const all: ReviewDoc[] = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const createdIso = data.review.createdAt.toDate().toISOString();
        const updatedIso = data.review.updatedAt.toDate().toISOString();

        // 사용자의 최신 프로필 정보 조회 (UI 표시용)
        let latestUser: ReviewUser = {
          uid: data.user.uid,
          displayName: data.user.displayName,
          photoKey: data.user.photoKey,
          activityLevel: "NEWBIE", // 기본값
        };

        try {
          const userRef = adminFirestore.collection("users").doc(data.user.uid);
          const userSnap = await userRef.get();
          if (userSnap.exists) {
            const userData = userSnap.data();
            latestUser.displayName =
              userData?.displayName || latestUser.displayName;
            latestUser.photoKey = userData?.photoKey || latestUser.photoKey;
            latestUser.activityLevel = userData?.activityLevel || "NEWBIE";
          }
        } catch (error) {
          console.warn(`사용자 ${data.user.uid}의 프로필 조회 실패:`, error);
        }

        return {
          id: doc.id,
          user: latestUser,
          review: {
            ...data.review,
            createdAt: createdIso,
            updatedAt: updatedIso,
          },
        };
      }),
    );

    // 7) 클라이언트 사이드에서 검색 필터링
    let filteredReviews = all;
    if (search) {
      filteredReviews = all.filter((review) => {
        const searchTerm = search.toLowerCase();
        return (
          review.review.movieTitle.toLowerCase().includes(searchTerm) ||
          review.review.reviewTitle.toLowerCase().includes(searchTerm) ||
          review.review.reviewContent.toLowerCase().includes(searchTerm)
        );
      });
    }

    // 8) 페이지 슬라이스
    const start = (page - 1) * pageSize;
    return {
      reviews: filteredReviews.slice(start, start + pageSize),
      totalPages: search
        ? Math.ceil(filteredReviews.length / pageSize)
        : totalPages,
    };
  } catch (error) {
    console.error("리뷰 조회 실패:", error);
    throw new Error("리뷰 조회에 실패했습니다.");
  }
}
