import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

// DELETE /api/users/[uid] - 회원 탈퇴
export async function DELETE(
  req: NextRequest,
  { params }: { params: { uid: string } },
) {
  try {
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const ownershipResult = verifyResourceOwnership(
      authResult.uid!,
      params.uid,
    );
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    const uid = params.uid;
    const userRef = adminFirestore.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const userData = userSnap.data();
    const displayName = userData?.displayName;

    const batch = adminFirestore.batch();

    // 1. 'users' 컬렉션에서 사용자 문서 삭제
    batch.delete(userRef);

    // 2. 'usernames' 컬렉션에서 닉네임 문서 삭제
    if (displayName) {
      const usernameRef = adminFirestore
        .collection("usernames")
        .doc(displayName);
      batch.delete(usernameRef);
    }

    // 3. 'movie-reviews' 컬렉션에서 사용자가 작성한 리뷰 삭제
    const reviewsQuery = adminFirestore
      .collection("movie-reviews")
      .where("uid", "==", uid);
    const reviewsSnapshot = await reviewsQuery.get();
    reviewsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 4. 'review-likes' 컬렉션에서 사용자가 누른 좋아요 삭제
    const likesQuery = adminFirestore
      .collection("review-likes")
      .where("uid", "==", uid);
    const likesSnapshot = await likesQuery.get();
    likesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 5. 'comments' 컬렉션에서 사용자가 작성한 댓글 삭제
    const commentsQuery = adminFirestore
      .collection("comments")
      .where("uid", "==", uid);
    const commentsSnapshot = await commentsQuery.get();
    commentsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 6. 일괄 작업 실행
    await batch.commit();

    // 7. Firebase Auth에서 사용자 삭제
    await adminAuth.deleteUser(uid);

    return NextResponse.json({
      message: "회원 탈퇴가 성공적으로 처리되었습니다.",
    });
  } catch (error) {
    console.error("회원 탈퇴 처리 실패:", error);
    return NextResponse.json(
      { error: "회원 탈퇴 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}
