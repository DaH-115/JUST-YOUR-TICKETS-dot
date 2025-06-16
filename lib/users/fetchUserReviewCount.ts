import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "firebase-config";

export async function fetchUserReviewCount(uid: string): Promise<number> {
  if (!uid) return 0;

  try {
    const reviewsQuery = query(
      collection(db, "movie-reviews"),
      where("user.uid", "==", uid),
    );
    const countSnapshot = await getCountFromServer(reviewsQuery);
    return countSnapshot.data().count;
  } catch (error) {
    console.error("사용자 리뷰 개수 조회 실패:", error);
    return 0;
  }
}
