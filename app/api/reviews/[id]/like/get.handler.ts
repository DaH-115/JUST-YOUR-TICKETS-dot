import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";

// GET /api/reviews/[id]/like - 좋아요 상태 확인
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
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

    const uid = authResult.uid!;
    const reviewId = params.id;

    // Admin SDK 사용
    const likeRef = adminFirestore
      .collection("review-likes")
      .doc(`${uid}_${reviewId}`);
    const likeSnap = await likeRef.get();

    return NextResponse.json({
      isLiked: likeSnap.exists,
    });
  } catch (error) {
    console.error("좋아요 상태 확인 실패:", error);
    return NextResponse.json(
      { error: "좋아요 상태 확인에 실패했습니다." },
      { status: 500 },
    );
  }
}
