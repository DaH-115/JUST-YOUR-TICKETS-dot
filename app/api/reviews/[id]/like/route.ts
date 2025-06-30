import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { verifyAuthToken } from "lib/auth/verifyToken";

// POST /api/reviews/[id]/like - 좋아요 추가
export async function POST(
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

    const { movieTitle } = await req.json();

    // 필수 필드 검증
    if (!movieTitle?.trim()) {
      return NextResponse.json(
        { error: "movieTitle이 필요합니다." },
        { status: 400 },
      );
    }

    const uid = authResult.uid!;
    const reviewId = params.id;

    // Admin SDK 사용
    const reviewRef = adminFirestore.collection("movie-reviews").doc(reviewId);
    const likeRef = adminFirestore
      .collection("review-likes")
      .doc(`${uid}_${reviewId}`);

    // 리뷰 존재 확인
    const reviewSnap = await reviewRef.get();
    if (!reviewSnap.exists) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 이미 좋아요한 상태인지 확인
    const likeSnap = await likeRef.get();
    if (likeSnap.exists) {
      return NextResponse.json(
        { error: "이미 좋아요한 리뷰입니다." },
        { status: 409 },
      );
    }

    // 좋아요 추가와 리뷰 좋아요 수 증가를 트랜잭션으로 원자적 처리
    await adminFirestore.runTransaction(async (transaction) => {
      // 좋아요 문서 생성
      transaction.set(likeRef, {
        uid,
        reviewId,
        createdAt: FieldValue.serverTimestamp(),
        movieTitle: movieTitle.trim(),
      });

      // 리뷰의 좋아요 수 증가
      transaction.update(reviewRef, {
        "review.likeCount": FieldValue.increment(1),
      });
    });

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/liked-ticket-list");

    return NextResponse.json(
      {
        success: true,
        message: "좋아요가 추가되었습니다.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("좋아요 추가 실패:", error);
    return NextResponse.json(
      { error: "좋아요 추가에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/reviews/[id]/like - 좋아요 취소
export async function DELETE(
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
    const reviewRef = adminFirestore.collection("movie-reviews").doc(reviewId);
    const likeRef = adminFirestore
      .collection("review-likes")
      .doc(`${uid}_${reviewId}`);

    // 리뷰 존재 확인
    const reviewSnap = await reviewRef.get();
    if (!reviewSnap.exists) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 좋아요한 상태인지 확인
    const likeSnap = await likeRef.get();
    if (!likeSnap.exists) {
      return NextResponse.json(
        { error: "좋아요하지 않은 리뷰입니다." },
        { status: 409 },
      );
    }

    // 좋아요 취소와 리뷰 좋아요 수 감소를 트랜잭션으로 원자적 처리
    await adminFirestore.runTransaction(async (transaction) => {
      // 좋아요 문서 삭제
      transaction.delete(likeRef);

      // 리뷰의 좋아요 수 감소
      transaction.update(reviewRef, {
        "review.likeCount": FieldValue.increment(-1),
      });
    });

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/liked-ticket-list");

    return NextResponse.json(
      {
        success: true,
        message: "좋아요가 취소되었습니다.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("좋아요 취소 실패:", error);
    return NextResponse.json(
      { error: "좋아요 취소에 실패했습니다." },
      { status: 500 },
    );
  }
}

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
