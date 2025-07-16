import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";

// POST /api/reviews/[id]/like - 좋아요 추가
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    console.log("❤️ 좋아요 추가 API 호출됨, reviewId:", params.id);

    // Firebase Admin SDK로 토큰 검증
    const authResult = await verifyAuthToken(req);
    console.log("🔐 인증 결과:", authResult);

    if (!authResult.success) {
      console.log("❌ 인증 실패:", authResult.error);
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const { movieTitle } = await req.json();
    console.log("🎬 영화 제목:", movieTitle);

    // 필수 필드 검증
    if (!movieTitle?.trim()) {
      return NextResponse.json(
        { error: "movieTitle이 필요합니다." },
        { status: 400 },
      );
    }

    const uid = authResult.uid!;
    const reviewId = params.id;
    console.log("👤 사용자 UID:", uid, "리뷰 ID:", reviewId);

    const reviewRef = adminFirestore.collection("movie-reviews").doc(reviewId);
    const likeRef = reviewRef.collection("likedBy").doc(uid);

    // 리뷰 존재 확인
    const reviewSnap = await reviewRef.get();
    if (!reviewSnap.exists) {
      console.log("❌ 리뷰를 찾을 수 없음:", reviewId);
      return NextResponse.json(
        { error: "리뷰를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 이미 좋아요한 상태인지 확인
    const likeSnap = await likeRef.get();
    console.log("🔍 기존 좋아요 상태:", likeSnap.exists);

    if (likeSnap.exists) {
      console.log("⚠️ 이미 좋아요한 리뷰입니다");
      return NextResponse.json(
        { error: "이미 좋아요한 리뷰입니다." },
        { status: 409 },
      );
    }

    console.log("💾 좋아요 데이터 저장 시작...");

    // 트랜잭션 전 현재 likeCount 확인
    const beforeReviewSnap = await reviewRef.get();
    const reviewData = beforeReviewSnap.data();
    const beforeLikeCount = reviewData?.likeCount;
    console.log("📊 트랜잭션 전 리뷰 데이터:", {
      hasLikeCount: "likeCount" in (reviewData || {}),
      likeCount: beforeLikeCount,
      reviewTitle: reviewData?.review?.reviewTitle,
    });

    // 좋아요 추가와 리뷰 좋아요 수 증가를 트랜잭션으로 원자적 처리
    await adminFirestore.runTransaction(async (transaction) => {
      console.log("🔄 트랜잭션 시작...");

      // 좋아요 문서 생성 (경로 수정됨)
      transaction.set(likeRef, {
        uid, // 컬렉션 그룹 쿼리를 위해 uid 필드 추가
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log("✅ 좋아요 문서 생성 완료");

      // 리뷰의 좋아요 수 증가 (최상위 레벨)
      transaction.update(reviewRef, {
        likeCount: FieldValue.increment(1),
      });
      console.log("✅ likeCount 증가 완료");

      // 사용자의 좋아요한 티켓 수 증가
      const userRef = adminFirestore.collection("users").doc(uid);
      transaction.update(userRef, {
        likedTicketsCount: FieldValue.increment(1),
      });
      console.log("✅ 사용자 likedTicketsCount 증가 완료");
    });

    console.log("✅ 트랜잭션 완료");

    // 트랜잭션 후 실제 데이터베이스에서 값 재확인
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 대기
    const updatedReviewSnap = await reviewRef.get();
    const updatedData = updatedReviewSnap.data();
    const updatedLikeCount = updatedData?.likeCount || 0;

    console.log("📊 트랜잭션 후 실제 DB 데이터:", {
      docExists: updatedReviewSnap.exists,
      likeCount: updatedLikeCount,
      reviewTitle: updatedData?.reviewTitle || updatedData?.review?.reviewTitle,
      fullData: updatedData,
    });

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/my-page/liked-ticket-list");

    return NextResponse.json(
      {
        success: true,
        message: "좋아요가 추가되었습니다.",
        likeCount: updatedLikeCount,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ 좋아요 추가 실패:", error);
    return NextResponse.json(
      { error: "좋아요 추가에 실패했습니다." },
      { status: 500 },
    );
  }
}
