import { NextRequest, NextResponse } from "next/server";
import { db } from "firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";

// GET /api/comments/[reviewId] - 특정 리뷰의 댓글 목록 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { reviewId: string } },
) {
  try {
    const commentsCol = collection(
      db,
      "movie-reviews",
      params.reviewId,
      "comments",
    );
    const q = query(commentsCol, orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);

    const comments = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        authorId: data.authorId,
        displayName: data.displayName || "익명",
        photoURL: data.photoURL,
        content: data.content,
        createdAt:
          data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate().toISOString(),
      };
    });

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
    // Firebase Admin SDK로 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const { authorId, displayName, photoURL, content } = await req.json();

    // 필수 필드 검증
    if (!authorId || !content?.trim()) {
      return NextResponse.json(
        { error: "authorId와 content가 필요합니다." },
        { status: 400 },
      );
    }

    // 리소스 소유자 권한 확인
    const ownershipResult = verifyResourceOwnership(authResult.uid!, authorId);
    if (!ownershipResult.success) {
      return NextResponse.json(
        { error: ownershipResult.error },
        { status: ownershipResult.statusCode || 403 },
      );
    }

    // 댓글 생성
    const newComment = {
      authorId,
      displayName: displayName || "익명",
      photoURL: photoURL || null,
      content: content.trim(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "movie-reviews", params.reviewId, "comments"),
      newComment,
    );

    // 캐시 재검증 (필요한 경우)
    revalidatePath("/ticket-list");

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
