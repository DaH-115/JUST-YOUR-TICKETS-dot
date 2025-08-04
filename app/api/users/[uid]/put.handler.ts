import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  getS3Url,
  updateReviewsDisplayName,
  updateCommentsDisplayName,
  updateReviewsPhotoKey,
  updateCommentsPhotoKey,
} from "app/api/users/[uid]/route.helper";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

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
    const { biography, displayName, photoKey } = updateData;

    // 필수 필드 검증
    if (!biography && !displayName && !photoKey) {
      return NextResponse.json(
        {
          error: "biography, displayName, 또는 photoKey 중 하나는 필요합니다.",
        },
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

    interface ResponseData {
      biography?: string;
      displayName?: string;
      photoKey?: string;
      photoURL?: string;
    }
    const responseData: ResponseData = {};

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
            displayName,
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
      } catch (error) {
        if (
          error instanceof Error &&
          error.message?.includes("이미 사용 중인 닉네임")
        ) {
          return NextResponse.json({ error: error.message }, { status: 409 });
        }
        console.error("닉네임 업데이트 중 오류 발생:", error);
        return NextResponse.json(
          { error: "profile/update-failed" },
          { status: 500 },
        );
      }
    }

    // photoKey 업데이트
    if (photoKey !== undefined) {
      try {
        await userRef.update({
          photoKey,
          updatedAt: new Date(),
        });

        // photoURL 생성 (클라이언트에서 사용)
        const photoURL = await getS3Url(photoKey);

        // Firebase Auth 프로필 사진 업데이트 (백그라운드)
        adminAuth.updateUser(params.uid, { photoURL }).catch((error) => {
          console.error("Firebase Auth 사진 업데이트 실패:", error);
        });

        // 기존 리뷰들의 사용자 사진 업데이트 (백그라운드)
        updateReviewsPhotoKey(params.uid, photoKey).catch((error) => {
          console.error("리뷰 사진 업데이트 실패:", error);
        });

        // 기존 댓글들의 사용자 사진 업데이트 (백그라운드)
        updateCommentsPhotoKey(params.uid, photoKey).catch((error) => {
          console.error("댓글 사진 업데이트 실패:", error);
        });

        responseData.photoKey = photoKey;
        responseData.photoURL = photoURL;
      } catch (error) {
        console.error("프로필 사진 업데이트 중 오류 발생:", error);
        return NextResponse.json(
          { error: "프로필 사진 업데이트 중 오류가 발생했습니다." },
          { status: 500 },
        );
      }
    }

    // Next.js 캐시 무효화
    revalidatePath(`/my-page`);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("사용자 프로필 업데이트 실패:", error);
    return NextResponse.json(
      { error: "사용자 프로필 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}
