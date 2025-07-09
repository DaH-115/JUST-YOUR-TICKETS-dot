import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";

// DELETE /api/comments/[reviewId]/[commentId] - 댓글 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { reviewId: string; commentId: string } },
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

    // Firestore 트랜잭션을 사용하여 댓글 삭제와 카운트 업데이트를 원자적으로 처리
    const reviewRef = adminFirestore
      .collection("movie-reviews")
      .doc(params.reviewId);
    const commentRef = reviewRef.collection("comments").doc(params.commentId);

    let authorId = "";

    await adminFirestore.runTransaction(async (transaction) => {
      // 댓글 문서가 존재하는지 확인
      const commentDoc = await transaction.get(commentRef);
      if (!commentDoc.exists) {
        throw new Error("댓글을 찾을 수 없습니다.");
      }

      // 댓글 작성자 권한 확인
      const commentData = commentDoc.data();
      authorId = commentData!.authorId; // 트랜잭션 외부에서 사용하기 위해 authorId 저장
      const ownershipResult = verifyResourceOwnership(
        authResult.uid!,
        commentData!.authorId,
      );
      if (!ownershipResult.success) {
        // 트랜잭션 내에서 특정 상태 코드를 반환하기 위해 커스텀 에러 사용
        const error = new Error("접근 권한이 없습니다.");
        (error as any).statusCode = 403;
        throw error;
      }

      // 메인 댓글 문서 삭제
      transaction.delete(commentRef);

      // 리뷰의 댓글 수 감소
      transaction.update(reviewRef, {
        commentsCount: FieldValue.increment(-1),
      });
    });

    // 사용자 활동 등급 업데이트
    await updateUserActivityLevel(authorId);

    // 캐시 재검증
    revalidatePath("/ticket-list");

    return NextResponse.json(
      {
        success: true,
        message: "댓글이 성공적으로 삭제되었습니다.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("댓글 삭제 실패:", error);
    // 트랜잭션에서 던져진 커스텀 에러 처리
    if (error.statusCode === 403) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
