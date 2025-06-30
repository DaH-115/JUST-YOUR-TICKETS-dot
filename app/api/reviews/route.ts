import { NextRequest, NextResponse } from "next/server";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import { adminFirestore } from "firebase-admin-config";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { updateUserActivityLevel } from "lib/users/updateUserActivityLevel";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const uid = searchParams.get("uid") ?? undefined;

  const data = await fetchReviewsPaginated({ page, pageSize, uid });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    // Firebase Admin SDK로 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const reviewData = await req.json();

    // 필수 필드 검증
    if (!reviewData.user || !reviewData.review) {
      return NextResponse.json(
        { error: "user와 review 데이터가 필요합니다." },
        { status: 400 },
      );
    }

    // 리소스 소유자 권한 확인
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

    // Firestore에 리뷰 생성
    const newReview = {
      user: reviewData.user,
      review: {
        ...reviewData.review,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        likeCount: 0,
      },
    };

    const docRef = await adminFirestore
      .collection("movie-reviews")
      .add(newReview);

    // 사용자 등급 업데이트
    try {
      await updateUserActivityLevel(reviewData.user.uid);
    } catch (error) {
      console.error("사용자 등급 업데이트 실패:", error);
      // 등급 업데이트 실패는 리뷰 생성에 영향을 주지 않음
    }

    // 캐시 재검증
    revalidatePath("/ticket-list");
    revalidatePath("/"); // 홈페이지도 재검증
    revalidateTag("reviews"); // 리뷰 관련 모든 캐시 무효화

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: "리뷰가 성공적으로 생성되었습니다.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("리뷰 생성 실패:", error);
    return NextResponse.json(
      { error: "리뷰 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
