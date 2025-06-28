import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { revalidatePath } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

// GET /api/users/[uid] - 사용자 프로필 조회
export async function GET(
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

    return NextResponse.json({
      provider: userData?.provider,
      biography: userData?.biography,
      createdAt:
        userData?.createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt:
        userData?.updatedAt?.toDate().toISOString() || new Date().toISOString(),
    });
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
      // Firebase Admin SDK를 사용한 트랜잭션
      const batch = adminFirestore.batch();

      try {
        // 현재 사용자 정보 가져오기
        const authUser = await adminAuth.getUser(params.uid);
        const oldDisplayName = authUser.displayName;

        // 새 닉네임이 이미 사용 중인지 확인
        const newDisplayNameRef = adminFirestore
          .collection("usernames")
          .doc(displayName);
        const newDisplayNameSnapshot = await newDisplayNameRef.get();
        if (newDisplayNameSnapshot.exists) {
          throw new Error("이미 사용 중인 닉네임입니다.");
        }

        // 기존 닉네임이 있다면 usernames 컬렉션에서 삭제
        if (oldDisplayName) {
          const oldDisplayNameRef = adminFirestore
            .collection("usernames")
            .doc(oldDisplayName);
          batch.delete(oldDisplayNameRef);
        }

        // 새 닉네임을 usernames 컬렉션에 등록
        batch.set(newDisplayNameRef, {
          uid: params.uid,
          createdAt: new Date(),
        });

        // users 컬렉션의 updatedAt 필드 업데이트
        batch.update(userRef, {
          updatedAt: new Date(),
        });

        // 배치 실행
        await batch.commit();

        // Firebase Auth의 displayName 업데이트
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
