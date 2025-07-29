import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";

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

    const reviewRef = adminFirestore.collection("movie-reviews").doc(reviewId);
    const likeRef = reviewRef.collection("likedBy").doc(uid);

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

    // 트랜잭션 전 현재 likeCount 확인
    const beforeReviewSnap = await reviewRef.get();
    const reviewData = beforeReviewSnap.data();
    const beforeLikeCount = reviewData?.likeCount || 0;
    console.log("📊 트랜잭션 전 likeCount:", beforeLikeCount);

    // 좋아요 취소와 리뷰 좋아요 수 감소를 트랜잭션으로 원자적 처리
    await adminFirestore.runTransaction(async (transaction) => {
      console.log("🔄 삭제 트랜잭션 시작...");

      // 좋아요 문서 삭제 (경로 수정됨)
      transaction.delete(likeRef);
      console.log("✅ 좋아요 문서 삭제 완료");

      // 리뷰의 좋아요 수 감소 (최상위 레벨)
      transaction.update(reviewRef, {
        likeCount: FieldValue.increment(-1),
      });
      console.log("✅ likeCount 감소 완료");

      // 사용자의 좋아요한 티켓 수 감소
      const userRef = adminFirestore.collection("users").doc(uid);
      transaction.update(userRef, {
        likedTicketsCount: FieldValue.increment(-1),
      });
      console.log("✅ 사용자 likedTicketsCount 감소 완료");
    });

    console.log("✅ 삭제 트랜잭션 완료");

    // 업데이트된 likeCount를 가져오기 위해 문서를 다시 읽음
    const updatedReviewSnap = await reviewRef.get();
    const updatedData = updatedReviewSnap.data();
    const updatedLikeCount = updatedData?.likeCount || 0;

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/liked-ticket-list");

    return NextResponse.json(
      {
        success: true,
        message: "좋아요가 취소되었습니다.",
        likeCount: updatedLikeCount,
        isLiked: false, // 좋아요 취소 후 상태
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
