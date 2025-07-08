import { NextRequest, NextResponse } from "next/server";
import { adminFirestore, adminAuth } from "firebase-admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

// GET /api/comments/[reviewId] - 'movie-reviews' 컬렉션의 특정 리뷰의 댓글 목록 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: { reviewId: string } },
) {
  try {
    const commentsCol = adminFirestore
      .collection("movie-reviews")
      .doc(params.reviewId)
      .collection("comments");

    const querySnapshot = await commentsCol.orderBy("createdAt", "asc").get();

    const commentsPromises = querySnapshot.docs.map(async (doc) => {
      const data = doc.data();

      // 댓글 작성자의 최신 프로필 정보 조회
      let authorInfo = {
        displayName: data.displayName || "익명",
        photoKey: data.photoKey || null,
        activityLevel: data.activityLevel || "NEWBIE",
      };

      try {
        // 'users' 컬렉션에서 댓글 작성자의 프로필 정보 조회
        const userRef = adminFirestore.collection("users").doc(data.authorId);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
          const userData = userSnap.data();
          authorInfo.displayName =
            userData?.displayName || authorInfo.displayName;
          authorInfo.photoKey = userData?.photoKey || authorInfo.photoKey;
          authorInfo.activityLevel =
            userData?.activityLevel || authorInfo.activityLevel;
        }
      } catch (error) {
        console.warn(`사용자 ${data.authorId}의 프로필 조회 실패:`, error);
      }

      // 댓글 정보 반환 (댓글 내용 + 작성자 정보)
      return {
        id: doc.id,
        authorId: data.authorId,
        displayName: authorInfo.displayName,
        photoKey: authorInfo.photoKey,
        content: data.content,
        activityLevel: authorInfo.activityLevel,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      };
    });

    const comments = await Promise.all(commentsPromises);

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("댓글 조회 실패:", error);
    return NextResponse.json(
      { error: "댓글 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/comments/[reviewId] - 댓글 생성
export async function POST(
  req: NextRequest,
  { params }: { params: { reviewId: string } },
) {
  try {
    // 1. Firebase Admin SDK로 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    // 2. 요청 본문에서 댓글 작성자 ID와 내용 추출
    const { authorId, content } = await req.json();

    // 3. 필수 필드 검증
    if (!authorId || !content?.trim()) {
      return NextResponse.json(
        { error: "authorId와 content가 필요합니다." },
        { status: 400 },
      );
    }

    // 4. 리소스 소유자 권한 확인
    const ownershipResult = verifyResourceOwnership(authResult.uid!, authorId);
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    // 5. 서버 측에서 인증된 사용자의 정보 조회
    let displayName = "익명";
    let photoKey = null;
    let activityLevel = "NEWBIE";

    try {
      // Firestore 'users' 컬렉션에서 사용자 정보 조회
      const userRef = adminFirestore.collection("users").doc(authResult.uid!);
      const userSnap = await userRef.get();

      if (userSnap.exists) {
        const userData = userSnap.data();
        displayName = userData?.displayName || "익명";
        photoKey = userData?.photoKey || null;
        activityLevel = userData?.activityLevel || "NEWBIE";
      } else {
        // users 문서가 없는 경우, Auth 정보로 대체
        const authUser = await adminAuth.getUser(authResult.uid!);
        displayName = authUser.displayName || "익명";
      }
    } catch (error) {
      console.warn(
        `댓글 생성 시 사용자 정보(uid: ${authResult.uid}) 조회 실패:`,
        error,
      );
    }

    // 6. 댓글 생성
    const newComment = {
      authorId,
      displayName,
      photoKey: photoKey,
      activityLevel,
      content: content.trim(),
      createdAt: FieldValue.serverTimestamp(),
    };

    const docRef = await adminFirestore
      .collection("movie-reviews")
      .doc(params.reviewId)
      .collection("comments")
      .add(newComment);

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: "댓글이 성공적으로 등록되었습니다.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("댓글 생성 실패:", error);
    return NextResponse.json(
      { error: "댓글 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
