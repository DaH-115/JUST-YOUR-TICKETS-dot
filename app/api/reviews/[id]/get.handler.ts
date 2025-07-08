import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";

// GET /api/reviews/[id] - 개별 리뷰 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const reviewRef = adminFirestore.collection("movie-reviews").doc(params.id);
    const reviewSnap = await reviewRef.get();

    if (!reviewSnap.exists) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const reviewData = {
      id: reviewSnap.id,
      ...reviewSnap.data(),
    };

    return NextResponse.json(reviewData);
  } catch (error) {
    console.error("리뷰 조회 실패:", error);
    return NextResponse.json(
      { error: "리뷰 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
