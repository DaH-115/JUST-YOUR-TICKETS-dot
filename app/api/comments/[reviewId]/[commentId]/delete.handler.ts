import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { revalidatePath } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

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

    const commentRef = adminFirestore
      .collection("movie-reviews")
      .doc(params.reviewId)
      .collection("comments")
      .doc(params.commentId);

    // 댓글 존재 확인
    const commentSnap = await commentRef.get();
    if (!commentSnap.exists) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 댓글 작성자 권한 확인
    const commentData = commentSnap.data();
    const ownershipResult = verifyResourceOwnership(
      authResult.uid!,
      commentData!.authorId,
    );
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    // 댓글 삭제
    await commentRef.delete();

    // 캐시 재검증
    revalidatePath("/ticket-list");

    return NextResponse.json(
      {
        success: true,
        message: "댓글이 성공적으로 삭제되었습니다.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
