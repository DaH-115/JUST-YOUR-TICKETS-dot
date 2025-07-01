import { NextRequest, NextResponse } from "next/server";
import admin, { adminAuth, adminFirestore } from "firebase-admin-config";
import { revalidatePath } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { fetchUserReviewCount } from "lib/users/fetchUserReviewCount";

/**
 * 사용자의 모든 리뷰에서 displayName을 업데이트합니다.
 */
async function updateReviewsDisplayName(
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
async function updateCommentsDisplayName(
  uid: string,
  newDisplayName: string,
): Promise<void> {
  try {
    // 해당 사용자의 모든 댓글 조회
    const commentsQuery = adminFirestore
      .collectionGroup("comments")
      .where("authorId", "==", uid);

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

// GET /api/users/[uid] - 사용자 프로필 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const includeStats = searchParams.get("includeStats") === "true";
    const includeFullStats = searchParams.get("includeFullStats") === "true";

    // Firebase Admin SDK로 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    // 본인 프로필만 조회 가능
    const ownershipResult = verifyResourceOwnership(
      authResult.uid!,
      params.uid,
    );
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    const userRef = adminFirestore.collection("users").doc(params.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const userData = userSnap.data();
    const responseData: any = {
      provider: userData?.provider,
      biography: userData?.biography,
      createdAt:
        userData?.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt:
        userData?.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    };

    // 기본 통계 정보가 요청된 경우 리뷰 개수 추가
    if (includeStats) {
      // DB에 저장된 reviewCount가 있으면 사용, 없으면 계산
      if (userData?.reviewCount !== undefined) {
        responseData.reviewCount = userData.reviewCount;
      } else {
        responseData.reviewCount = await fetchUserReviewCount(params.uid);
      }

      // activityLevel도 함께 반환
      if (userData?.activityLevel) {
        responseData.activityLevel = userData.activityLevel;
      }
    }

    // 전체 통계 정보가 요청된 경우
    if (includeFullStats) {
      // 1. 내가 쓴 리뷰 개수 - DB에 저장된 값 우선 사용
      let myReviewsCount;
      if (userData?.reviewCount !== undefined) {
        myReviewsCount = userData.reviewCount;
      } else {
        myReviewsCount = await fetchUserReviewCount(params.uid);
      }

      // 2. 좋아요한 리뷰 개수 (실제 존재하는 리뷰만 카운트)
      const likesQuery = adminFirestore
        .collection("review-likes")
        .where("uid", "==", params.uid);

      const likesSnapshot = await likesQuery.get();
      const likedReviewIds = likesSnapshot.docs.map(
        (doc) => doc.data().reviewId,
      );

      // 실제 존재하는 리뷰들만 필터링
      let validLikedCount = 0;
      const cleanupPromises: Promise<void>[] = [];

      if (likedReviewIds.length > 0) {
        // Firestore 'in' 쿼리는 30개 아이템으로 제한되므로, 배열을 청크로 나눔
        const chunks: string[][] = [];
        for (let i = 0; i < likedReviewIds.length; i += 30) {
          chunks.push(likedReviewIds.slice(i, i + 30));
        }

        const reviewExistenceChecks = chunks.map((chunk) =>
          adminFirestore
            .collection("movie-reviews")
            .where(admin.firestore.FieldPath.documentId(), "in", chunk)
            .select() // 필드 없이 문서 존재 여부만 확인
            .get(),
        );

        const reviewSnapshots = await Promise.all(reviewExistenceChecks);
        const existingReviewIds = new Set<string>();
        reviewSnapshots.forEach((snapshot) => {
          snapshot.docs.forEach((doc) => existingReviewIds.add(doc.id));
        });

        validLikedCount = existingReviewIds.size;

        // 존재하지 않는 리뷰에 대한 좋아요 데이터 정리
        likesSnapshot.docs.forEach((doc) => {
          const reviewId = doc.data().reviewId;
          if (!existingReviewIds.has(reviewId)) {
            cleanupPromises.push(doc.ref.delete().then(() => {}));
          }
        });
      }

      // 정리 작업이 완료될 때까지 대기
      if (cleanupPromises.length > 0) {
        await Promise.all(cleanupPromises);
      }

      responseData.stats = {
        myTicketsCount: myReviewsCount,
        likedTicketsCount: validLikedCount,
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("사용자 프로필 조회 실패:", error);
    return NextResponse.json(
      { error: "사용자 프로필 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

// PUT /api/users/[uid] - 사용자 프로필 업데이트
export async function PUT(
  req: NextRequest,
  { params }: { params: { uid: string } },
) {
  try {
    // Firebase Admin SDK로 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    // 본인 프로필만 수정 가능
    const ownershipResult = verifyResourceOwnership(
      authResult.uid!,
      params.uid,
    );
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    const updateData = await req.json();
    const { biography, displayName } = updateData;

    // 필수 필드 검증
    if (!biography && !displayName) {
      return NextResponse.json(
        { error: "biography 또는 displayName 중 하나는 필요합니다." },
        { status: 400 },
      );
    }

    const userRef = adminFirestore.collection("users").doc(params.uid);

    // 사용자 존재 확인
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const responseData: any = {};

    // biography 업데이트
    if (biography !== undefined) {
      await userRef.update({
        biography: biography.trim(),
        updatedAt: new Date(),
      });
      responseData.biography = biography.trim();
    }

    // displayName 업데이트 (더 복잡한 로직)
    if (displayName !== undefined) {
      try {
        // 현재 사용자 정보 가져오기
        const authUser = await adminAuth.getUser(params.uid);
        const oldDisplayName = authUser.displayName;

        // Firestore 트랜잭션을 사용하여 닉네임 중복 검사와 등록을 원자적으로 처리
        await adminFirestore.runTransaction(async (transaction) => {
          // 새 닉네임이 이미 사용 중인지 확인
          const newDisplayNameRef = adminFirestore
            .collection("usernames")
            .doc(displayName);
          const newDisplayNameSnapshot =
            await transaction.get(newDisplayNameRef);

          if (newDisplayNameSnapshot.exists) {
            throw new Error("이미 사용 중인 닉네임입니다.");
          }

          // 기존 닉네임이 있다면 usernames 컬렉션에서 삭제
          if (oldDisplayName) {
            const oldDisplayNameRef = adminFirestore
              .collection("usernames")
              .doc(oldDisplayName);
            transaction.delete(oldDisplayNameRef);
          }

          // 새 닉네임을 usernames 컬렉션에 등록
          transaction.set(newDisplayNameRef, {
            uid: params.uid,
            createdAt: new Date(),
          });

          // users 컬렉션의 updatedAt 필드 업데이트
          transaction.update(userRef, {
            updatedAt: new Date(),
          });
        });

        // Firebase Auth의 displayName 업데이트 (트랜잭션 외부에서 실행)
        await adminAuth.updateUser(params.uid, { displayName });

        // 기존 리뷰들의 사용자 닉네임 업데이트 (백그라운드에서 실행)
        updateReviewsDisplayName(params.uid, displayName).catch((error) => {
          console.error("리뷰 닉네임 업데이트 실패:", error);
        });

        // 기존 댓글들의 사용자 닉네임 업데이트 (백그라운드에서 실행)
        updateCommentsDisplayName(params.uid, displayName).catch((error) => {
          console.error("댓글 닉네임 업데이트 실패:", error);
        });

        responseData.displayName = displayName;
      } catch (error: any) {
        if (error.message?.includes("이미 사용 중인 닉네임")) {
          throw error;
        }
        throw new Error("닉네임 업데이트에 실패했습니다.");
      }
    }

    // 공통 응답 데이터
    responseData.updatedAt = new Date().toISOString();

    // 캐시 재검증
    revalidatePath("/my-page");
    revalidatePath("/ticket-list");
    revalidatePath("/");
    revalidatePath("/my-page/my-ticket-list");
    revalidatePath("/my-page/liked-ticket-list");

    return NextResponse.json({
      success: true,
      message: "프로필이 성공적으로 업데이트되었습니다.",
      data: responseData,
    });
  } catch (error: any) {
    console.error("사용자 프로필 업데이트 실패:", error);

    // 닉네임 중복 에러 처리
    if (error.message?.includes("이미 사용 중인 닉네임")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "사용자 프로필 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}
