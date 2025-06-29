import { adminFirestore } from "firebase-admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { fetchUserReviewCount } from "lib/users/fetchUserReviewCount";
import { getActivityLevel } from "lib/utils/getActivityLevel";

/**
 * 사용자의 활동 등급과 리뷰 개수를 업데이트합니다.
 * @param uid 사용자 UID
 */
export async function updateUserActivityLevel(uid: string): Promise<void> {
  if (!uid) {
    throw new Error("uid가 필요합니다.");
  }

  try {
    // 현재 사용자의 리뷰 개수 조회
    const reviewCount = await fetchUserReviewCount(uid);

    // 리뷰 개수에 따른 활동 등급 계산
    const activityLevel = getActivityLevel(reviewCount);

    // 사용자 문서 업데이트
    const userRef = adminFirestore.collection("users").doc(uid);

    await userRef.update({
      reviewCount,
      activityLevel: activityLevel.label,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("사용자 등급 업데이트 실패:", error);
    throw error;
  }
}
