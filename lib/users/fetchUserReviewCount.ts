import { adminFirestore } from "firebase-admin-config";

export async function fetchUserReviewCount(uid: string): Promise<number> {
  if (!uid) return 0;

  try {
    const reviewsQuery = adminFirestore
      .collection("movie-reviews")
      .where("user.uid", "==", uid);

    const countSnapshot = await reviewsQuery.count().get();
    return countSnapshot.data().count;
  } catch (error) {
    console.error("사용자 리뷰 개수 조회 실패:", error);
    return 0;
  }
}
