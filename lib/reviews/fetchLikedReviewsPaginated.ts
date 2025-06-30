import { adminFirestore } from "firebase-admin-config";
import { SerializableUser } from "store/redux-toolkit/slice/userSlice";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

interface FetchLikedReviewsParams {
  page: number;
  pageSize: number;
  uid: string;
  search?: string;
}

export async function fetchLikedReviewsPaginated({
  page,
  pageSize,
  uid,
  search = "",
}: FetchLikedReviewsParams): Promise<{
  reviews: ReviewDoc[];
  totalPages: number;
}> {
  try {
    // 1) 사용자가 좋아요한 리뷰 ID 목록 조회
    const likesQuery = adminFirestore
      .collection("review-likes")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc");

    const likesSnapshot = await likesQuery.get();
    const likedReviewIds = likesSnapshot.docs.map((doc) => doc.data().reviewId);

    if (likedReviewIds.length === 0) {
      return { reviews: [], totalPages: 0 };
    }

    // 2) 해당 리뷰들의 상세 정보 조회 및 사용자 등급 정보 추가
    const reviewPromises = likedReviewIds.map(async (reviewId) => {
      const reviewDoc = await adminFirestore
        .collection("movie-reviews")
        .doc(reviewId)
        .get();

      if (!reviewDoc.exists) return null;

      const data = reviewDoc.data()!;
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
        id: reviewDoc.id,
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
    });

    const allReviews = (await Promise.all(reviewPromises)).filter(
      (review): review is ReviewDoc => review !== null,
    );

    // 3) 검색 필터링 (클라이언트 사이드에서 처리)
    let filteredReviews = allReviews;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReviews = allReviews.filter(
        (review) =>
          review.review.movieTitle.toLowerCase().includes(searchLower) ||
          review.review.reviewTitle.toLowerCase().includes(searchLower) ||
          review.review.reviewContent.toLowerCase().includes(searchLower),
      );
    }

    // 4) 페이지네이션
    const totalPages = Math.ceil(filteredReviews.length / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedReviews = filteredReviews.slice(start, end);

    return { reviews: paginatedReviews, totalPages };
  } catch (error) {
    console.error("좋아요한 리뷰 목록 조회 실패:", error);
    return { reviews: [], totalPages: 0 };
  }
}
