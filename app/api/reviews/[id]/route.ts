import { NextRequest, NextResponse } from "next/server";
import { db } from "firebase-config";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

// GET /api/reviews/[id] - 개별 리뷰 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const reviewRef = doc(db, "movie-reviews", params.id);
    const reviewSnap = await getDoc(reviewRef);

    if (!reviewSnap.exists()) {
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

// PUT /api/reviews/[id] - 리뷰 수정
export async function PUT(
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

    const updateData = await req.json();

    if (
      !updateData.reviewTitle ||
      !updateData.reviewContent ||
      !updateData.rating
    ) {
      return NextResponse.json(
        { error: "reviewTitle, reviewContent, rating이 필요합니다." },
        { status: 400 },
      );
    }

    const reviewRef = doc(db, "movie-reviews", params.id);

    // 문서 존재 확인
    const reviewSnap = await getDoc(reviewRef);
    if (!reviewSnap.exists()) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 리뷰 작성자 권한 확인
    const reviewData = reviewSnap.data();
    const ownershipResult = verifyResourceOwnership(
      authResult.uid!,
      reviewData.user.uid,
    );
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    // 리뷰 업데이트
    await updateDoc(reviewRef, {
      "review.reviewTitle": updateData.reviewTitle,
      "review.reviewContent": updateData.reviewContent,
      "review.rating": updateData.rating,
      "review.updatedAt": serverTimestamp(),
    });

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/my-ticket-list");
    revalidatePath("/");
    revalidateTag("reviews");

    return NextResponse.json({
      success: true,
      message: "리뷰가 성공적으로 수정되었습니다.",
    });
  } catch (error) {
    console.error("리뷰 수정 실패:", error);
    return NextResponse.json(
      { error: "리뷰 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/reviews/[id] - 리뷰 삭제
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

    const reviewRef = doc(db, "movie-reviews", params.id);

    // 문서 존재 확인
    const reviewSnap = await getDoc(reviewRef);
    if (!reviewSnap.exists()) {
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 리뷰 작성자 권한 확인
    const reviewData = reviewSnap.data();
    const ownershipResult = verifyResourceOwnership(
      authResult.uid!,
      reviewData.user.uid,
    );
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    // 리뷰 삭제
    await deleteDoc(reviewRef);

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/my-ticket-list");
    revalidatePath("/my-page/liked-ticket-list");
    revalidatePath("/");
    revalidateTag("reviews");

    return NextResponse.json(
      {
        success: true,
        message: "리뷰가 성공적으로 삭제되었습니다.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("리뷰 삭제 실패:", error);
    return NextResponse.json(
      { error: "리뷰 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
