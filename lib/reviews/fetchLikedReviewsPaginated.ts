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

    // Firestore 'in' 쿼리는 최대 30개의 값을 가질 수 있습니다.
    const MAX_IN_QUERIES = 30;
    const reviewPromises = [];
    for (let i = 0; i < likedReviewIds.length; i += MAX_IN_QUERIES) {
      const chunk = likedReviewIds.slice(i, i + MAX_IN_QUERIES);
      reviewPromises.push(
        adminFirestore
          .collection("movie-reviews")
          .where("__name__", "in", chunk)
          .get(),
      );
    }

    const reviewSnapshots = await Promise.all(reviewPromises);
    const reviewsData = reviewSnapshots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as any),
    );

    // 사용자 정보 일괄 조회
    const userIds = [...new Set(reviewsData.map((review) => review.user.uid))];
    let usersMap = new Map<string, SerializableUser>();

    if (userIds.length > 0) {
      const userPromises = [];
      for (let i = 0; i < userIds.length; i += MAX_IN_QUERIES) {
        const chunk = userIds.slice(i, i + MAX_IN_QUERIES);
        userPromises.push(
          adminFirestore
            .collection("users")
            .where("__name__", "in", chunk)
            .get(),
        );
      }
      const userSnapshots = await Promise.all(userPromises);
      userSnapshots.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => {
          const userData = doc.data();
          usersMap.set(doc.id, {
            uid: doc.id,
            displayName: userData.displayName,
            email: userData.email,
            photoURL: userData.photoURL,
            activityLevel: userData.activityLevel || "NEWBIE",
          });
        });
      });
    }

    // 리뷰 데이터와 사용자 데이터 조합
    const allReviews: ReviewDoc[] = reviewsData
      .map((data) => {
        const user = usersMap.get(data.user.uid);
        if (!user) return null; // 사용자를 찾을 수 없는 경우

        const createdIso = data.review.createdAt.toDate().toISOString();
        const updatedIso = data.review.updatedAt.toDate().toISOString();

        return {
          id: data.id,
          user,
          review: {
            ...data.review,
            createdAt: createdIso,
            updatedAt: updatedIso,
          },
        };
      })
      .filter((review): review is ReviewDoc => review !== null);

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
