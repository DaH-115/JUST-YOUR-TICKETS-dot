import { adminFirestore } from "firebase-admin-config";
import admin from "firebase-admin";

/**
 * S3 key를 완전한 URL로 변환합니다.
 */
export function getS3Url(key: string): string {
  const bucketName = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION || "ap-northeast-2";
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

/**
 * 사용자의 모든 리뷰에서 displayName을 업데이트합니다.
 */
export async function updateReviewsDisplayName(
  uid: string,
  newDisplayName: string,
): Promise<void> {
  try {
    // 해당 사용자의 모든 리뷰 조회
    const reviewsQuery = adminFirestore
      .collection("movie-reviews")
      .where("user.uid", "==", uid);

    const reviewsSnapshot = await reviewsQuery.get();

    if (reviewsSnapshot.empty) {
      console.log(`사용자 ${uid}의 리뷰가 없습니다.`);
      return;
    }

    // 배치 업데이트 (Firestore 배치는 최대 500개 작업까지 가능)
    const batches: admin.firestore.WriteBatch[] = [];
    let currentBatch = adminFirestore.batch();
    let batchCount = 0;

    reviewsSnapshot.docs.forEach((doc) => {
      if (batchCount === 500) {
        batches.push(currentBatch);
        currentBatch = adminFirestore.batch();
        batchCount = 0;
      }

      currentBatch.update(doc.ref, {
        "user.displayName": newDisplayName,
        "review.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
      });
      batchCount++;
    });

    // 마지막 배치 추가
    if (batchCount > 0) {
      batches.push(currentBatch);
    }

    // 모든 배치 실행
    await Promise.all(batches.map((batch) => batch.commit()));

    console.log(
      `사용자 ${uid}의 리뷰 ${reviewsSnapshot.size}개의 닉네임을 ${newDisplayName}으로 업데이트했습니다.`,
    );
  } catch (error) {
    console.error(`리뷰 닉네임 업데이트 실패 (uid: ${uid}):`, error);
    throw error;
  }
}

/**
 * 사용자의 모든 댓글에서 displayName을 업데이트합니다.
 */
export async function updateCommentsDisplayName(
  uid: string,
  newDisplayName: string,
): Promise<void> {
  try {
    // 해당 사용자의 모든 댓글 조회
    const commentsQuery = adminFirestore
      .collectionGroup("comments")
      .where("authorId", "==", uid)
      .orderBy("createdAt", "asc");

    const commentsSnapshot = await commentsQuery.get();

    if (commentsSnapshot.empty) {
      console.log(`사용자 ${uid}의 댓글이 없습니다.`);
      return;
    }

    // 배치 업데이트
    const batches: admin.firestore.WriteBatch[] = [];
    let currentBatch = adminFirestore.batch();
    let batchCount = 0;

    commentsSnapshot.docs.forEach((doc) => {
      if (batchCount === 500) {
        batches.push(currentBatch);
        currentBatch = adminFirestore.batch();
        batchCount = 0;
      }

      currentBatch.update(doc.ref, {
        displayName: newDisplayName,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      batchCount++;
    });

    // 마지막 배치 추가
    if (batchCount > 0) {
      batches.push(currentBatch);
    }

    // 모든 배치 실행
    await Promise.all(batches.map((batch) => batch.commit()));

    console.log(
      `사용자 ${uid}의 댓글 ${commentsSnapshot.size}개의 닉네임을 ${newDisplayName}으로 업데이트했습니다.`,
    );
  } catch (error) {
    console.error(`댓글 닉네임 업데이트 실패 (uid: ${uid}):`, error);
    throw error;
  }
}

/**
 * 사용자의 모든 리뷰에서 photoURL을 업데이트합니다.
 */
export async function updateReviewsPhotoURL(
  uid: string,
  newPhotoKey: string,
): Promise<void> {
  try {
    // 해당 사용자의 모든 리뷰 조회
    const reviewsQuery = adminFirestore
      .collection("movie-reviews")
      .where("user.uid", "==", uid);

    const reviewsSnapshot = await reviewsQuery.get();

    if (reviewsSnapshot.empty) {
      console.log(`사용자 ${uid}의 리뷰가 없습니다.`);
      return;
    }

    // 배치 업데이트
    const batches: admin.firestore.WriteBatch[] = [];
    let currentBatch = adminFirestore.batch();
    let batchCount = 0;

    reviewsSnapshot.docs.forEach((doc) => {
      if (batchCount === 500) {
        batches.push(currentBatch);
        currentBatch = adminFirestore.batch();
        batchCount = 0;
      }

      currentBatch.update(doc.ref, {
        "user.photoURL": newPhotoKey,
        "review.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
      });
      batchCount++;
    });

    // 마지막 배치 추가
    if (batchCount > 0) {
      batches.push(currentBatch);
    }

    // 모든 배치 실행
    await Promise.all(batches.map((batch) => batch.commit()));

    console.log(
      `사용자 ${uid}의 리뷰 ${reviewsSnapshot.size}개의 프로필 이미지를 업데이트했습니다.`,
    );
  } catch (error) {
    console.error(`리뷰 프로필 이미지 업데이트 실패 (uid: ${uid}):`, error);
    throw error;
  }
}

/**
 * 사용자의 모든 댓글에서 photoURL을 업데이트합니다.
 */
export async function updateCommentsPhotoURL(
  uid: string,
  newPhotoKey: string,
): Promise<void> {
  try {
    // 해당 사용자의 모든 댓글 조회
    const commentsQuery = adminFirestore
      .collectionGroup("comments")
      .where("authorId", "==", uid)
      .orderBy("createdAt", "asc");

    const commentsSnapshot = await commentsQuery.get();

    if (commentsSnapshot.empty) {
      console.log(`사용자 ${uid}의 댓글이 없습니다.`);
      return;
    }

    // 배치 업데이트
    const batches: admin.firestore.WriteBatch[] = [];
    let currentBatch = adminFirestore.batch();
    let batchCount = 0;

    commentsSnapshot.docs.forEach((doc) => {
      if (batchCount === 500) {
        batches.push(currentBatch);
        currentBatch = adminFirestore.batch();
        batchCount = 0;
      }

      currentBatch.update(doc.ref, {
        photoURL: newPhotoKey,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      batchCount++;
    });

    // 마지막 배치 추가
    if (batchCount > 0) {
      batches.push(currentBatch);
    }

    // 모든 배치 실행
    await Promise.all(batches.map((batch) => batch.commit()));

    console.log(
      `사용자 ${uid}의 댓글 ${commentsSnapshot.size}개의 프로필 이미지를 업데이트했습니다.`,
    );
  } catch (error) {
    console.error(`댓글 프로필 이미지 업데이트 실패 (uid: ${uid}):`, error);
    throw error;
  }
}

/**
 * 사용자의 모든 댓글에서 activityLevel을 업데이트합니다.
 */
export async function updateCommentsActivityLevel(
  uid: string,
  newActivityLevel: string,
): Promise<void> {
  try {
    // 해당 사용자의 모든 댓글 조회
    const commentsQuery = adminFirestore
      .collectionGroup("comments")
      .where("authorId", "==", uid)
      .orderBy("createdAt", "asc");

    const commentsSnapshot = await commentsQuery.get();

    if (commentsSnapshot.empty) {
      console.log(`사용자 ${uid}의 댓글이 없습니다.`);
      return;
    }

    // 배치 업데이트
    const batches: admin.firestore.WriteBatch[] = [];
    let currentBatch = adminFirestore.batch();
    let batchCount = 0;

    commentsSnapshot.docs.forEach((doc) => {
      if (batchCount === 500) {
        batches.push(currentBatch);
        currentBatch = adminFirestore.batch();
        batchCount = 0;
      }

      currentBatch.update(doc.ref, {
        activityLevel: newActivityLevel,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      batchCount++;
    });

    // 마지막 배치 추가
    if (batchCount > 0) {
      batches.push(currentBatch);
    }

    // 모든 배치 실행
    await Promise.all(batches.map((batch) => batch.commit()));

    console.log(
      `사용자 ${uid}의 댓글 ${commentsSnapshot.size}개의 활동 등급을 ${newActivityLevel}(으)로 업데이트했습니다.`,
    );
  } catch (error) {
    console.error(`댓글 활동 등급 업데이트 실패 (uid: ${uid}):`, error);
    throw error;
  }
}
