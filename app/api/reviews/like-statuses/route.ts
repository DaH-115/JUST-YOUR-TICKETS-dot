import { adminFirestore as db } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🔍 like-statuses API 호출됨");

    const authResult = await verifyAuthToken(req);
    console.log("🔐 인증 결과:", authResult);

    if (!authResult.success) {
      console.log("❌ 인증 실패:", authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode },
      );
    }

    const { reviewIds } = (await req.json()) as { reviewIds: string[] };
    console.log("📋 조회할 리뷰 IDs:", reviewIds);

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { error: "reviewIds must be a non-empty array" },
        { status: 400 },
      );
    }

    const uid = authResult.uid as string;
    console.log("👤 현재 사용자 UID:", uid);

    const likesPromises = reviewIds.map(async (reviewId) => {
      console.log(`🔎 ${reviewId}에 대한 좋아요 상태 확인 중...`);
      const likeDoc = await db
        .collection("movie-reviews")
        .doc(reviewId)
        .collection("likedBy")
        .doc(uid)
        .get();
      const isLiked = likeDoc.exists;
      console.log(`📊 ${reviewId}: isLiked = ${isLiked}`);
      return { reviewId, isLiked };
    });

    const likesResults = await Promise.all(likesPromises);
    console.log("✅ 최종 좋아요 결과:", likesResults);

    const likesMap = likesResults.reduce(
      (acc, { reviewId, isLiked }) => {
        acc[reviewId] = isLiked;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    console.log("📤 반환할 데이터:", { likes: likesMap });
    return NextResponse.json({ likes: likesMap });
  } catch (error) {
    console.error("Error in POST /api/reviews/like-statuses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
