import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { revalidatePath } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { fetchUserReviewCount } from "lib/users/fetchUserReviewCount";

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

      for (const reviewId of likedReviewIds) {
        const reviewDoc = await adminFirestore
          .collection("movie-reviews")
          .doc(reviewId)
          .get();

        if (reviewDoc.exists) {
          validLikedCount++;
        } else {
          // 존재하지 않는 리뷰에 대한 좋아요 데이터 정리
          const likeDoc = likesSnapshot.docs.find(
            (doc) => doc.data().reviewId === reviewId,
          );
          if (likeDoc) {
            cleanupPromises.push(likeDoc.ref.delete().then(() => {}));
          }
        }
      }

      // 백그라운드에서 정리 작업 실행
      if (cleanupPromises.length > 0) {
        Promise.all(cleanupPromises).catch((error) => {
          console.warn("좋아요 데이터 정리 중 오류:", error);
        });
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
