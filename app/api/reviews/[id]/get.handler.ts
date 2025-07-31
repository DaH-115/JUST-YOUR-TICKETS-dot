import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

// GET /api/reviews/[id] - 개별 리뷰 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const uid = req.nextUrl.searchParams.get("uid"); // 쿼리 파라미터에서 uid 가져오기

    const doc = await adminFirestore.collection("movie-reviews").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const data = doc.data();
    if (!data) {
      return NextResponse.json(
        { error: "리뷰 데이터가 없습니다." },
        { status: 404 },
      );
    }

    // 좋아요 상태 확인
    let isLiked = false;
    if (uid) {
      const likeDoc = await adminFirestore
        .collection("movie-reviews")
        .doc(id)
        .collection("likedBy")
        .doc(uid)
        .get();
      isLiked = likeDoc.exists;
    }

    const reviewData: ReviewDoc = {
      id: doc.id,
      user: data.user,
      review: {
        ...data.review,
        likeCount: data.likeCount || data.review.likeCount || 0,
        createdAt:
          typeof data.review.createdAt?.toDate === "function"
            ? data.review.createdAt.toDate().toISOString()
            : "",
        updatedAt:
          typeof data.review.updatedAt?.toDate === "function"
            ? data.review.updatedAt.toDate().toISOString()
            : "",
        isLiked, // 동적으로 계산한 값
      },
    };

    return NextResponse.json(reviewData);
  } catch (error) {
    console.error("리뷰 조회 실패:", error);
    console.error(
      "에러 스택:",
      error instanceof Error ? error.stack : "Unknown error",
    );
    return NextResponse.json(
      { error: "리뷰 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
