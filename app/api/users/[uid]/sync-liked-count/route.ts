import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";

// PUT /api/users/[uid]/sync-liked-count - 사용자의 좋아요 개수 동기화
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

    const targetUid = params.uid;
    const requestingUid = authResult.uid!;

    // 본인의 데이터만 동기화 가능
    if (targetUid !== requestingUid) {
      return NextResponse.json(
        { error: "본인의 데이터만 동기화할 수 있습니다." },
        { status: 403 },
      );
    }

    console.log(
      `🔄 [sync-liked-count] 사용자 ${targetUid} 좋아요 개수 동기화 시작`,
    );

    // 1. 실제 좋아요한 리뷰 ID들 찾기
    const likesQuery = adminFirestore
      .collectionGroup("likedBy")
      .where("uid", "==", targetUid);

    const likesSnapshot = await likesQuery.get();
    const actualLikedCount = likesSnapshot.size;

    console.log(`📊 [sync-liked-count] 실제 좋아요 개수:`, actualLikedCount);

    // 2. 사용자 문서의 현재 likedTicketsCount 확인
    const userRef = adminFirestore.collection("users").doc(targetUid);
    const userSnap = await userRef.get();
    const currentCount = userSnap.data()?.likedTicketsCount || 0;

    console.log(`📊 [sync-liked-count] 현재 저장된 개수:`, currentCount);
    console.log(`📊 [sync-liked-count] 차이:`, actualLikedCount - currentCount);

    // 3. 사용자 문서 업데이트
    await userRef.update({
      likedTicketsCount: actualLikedCount,
    });

    console.log(
      `✅ [sync-liked-count] 동기화 완료: ${currentCount} → ${actualLikedCount}`,
    );

    return NextResponse.json({
      success: true,
      message: "좋아요 개수가 동기화되었습니다.",
      before: currentCount,
      after: actualLikedCount,
      difference: actualLikedCount - currentCount,
    });
  } catch (error) {
    console.error("좋아요 개수 동기화 실패:", error);
    return NextResponse.json(
      { error: "좋아요 개수 동기화에 실패했습니다." },
      { status: 500 },
    );
  }
}
