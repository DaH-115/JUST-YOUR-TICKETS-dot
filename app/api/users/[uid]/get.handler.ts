import { NextRequest, NextResponse } from "next/server";
import admin, { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { fetchUserReviewCount } from "lib/users/fetchUserReviewCount";

// GET /api/users/[uid] - 사용자 프로필 조회 (통계 정보 포함)
export async function GET(
  req: NextRequest,
  { params }: { params: { uid: string } },
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

    // 본인 프로필만 조회 가능
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

    const userRef = adminFirestore.collection("users").doc(params.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const userData = userSnap.data();

    // 1. 내가 쓴 리뷰 개수 - DB에 저장된 값 우선 사용
    let myReviewsCount;
    if (userData?.reviewCount !== undefined) {
      myReviewsCount = userData.reviewCount;
    } else {
      myReviewsCount = await fetchUserReviewCount(params.uid);
    }

    // 2. 좋아요한 리뷰 개수 (실제 존재하는 리뷰만 카운트)
    const likesQuery = adminFirestore
      .collection("review-likes")
      .where("uid", "==", params.uid);

    const likesSnapshot = await likesQuery.get();
    const likedReviewIds = likesSnapshot.docs.map((doc) => doc.data().reviewId);

    // 실제 존재하는 리뷰들만 필터링
    let validLikedCount = 0;
    const cleanupPromises: Promise<void>[] = [];

    if (likedReviewIds.length > 0) {
      // Firestore 'in' 쿼리는 30개 아이템으로 제한되므로, 배열을 청크로 나눔
      const chunks: string[][] = [];
      for (let i = 0; i < likedReviewIds.length; i += 30) {
        chunks.push(likedReviewIds.slice(i, i + 30));
      }

      const reviewExistenceChecks = chunks.map((chunk) =>
        adminFirestore
          .collection("movie-reviews")
          .where(admin.firestore.FieldPath.documentId(), "in", chunk)
          .select() // 필드 없이 문서 존재 여부만 확인
          .get(),
      );

      const reviewSnapshots = await Promise.all(reviewExistenceChecks);
      const existingReviewIds = new Set<string>();
      reviewSnapshots.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => existingReviewIds.add(doc.id));
      });

      validLikedCount = existingReviewIds.size;

      // 존재하지 않는 리뷰에 대한 좋아요 데이터 정리
      likesSnapshot.docs.forEach((doc) => {
        const reviewId = doc.data().reviewId;
        if (!existingReviewIds.has(reviewId)) {
          cleanupPromises.push(doc.ref.delete().then(() => {}));
        }
      });
    }

    // 정리 작업이 완료될 때까지 대기
    if (cleanupPromises.length > 0) {
      await Promise.all(cleanupPromises);
    }

    // 3. 응답 데이터 구성
    const responseData = {
      provider: userData?.provider,
      biography: userData?.biography,
      photoKey: userData?.photoKey,
      activityLevel: userData?.activityLevel,
      createdAt: userData?.createdAt?.toDate().toISOString() || null,
      updatedAt: userData?.updatedAt?.toDate().toISOString() || null,
      myTicketsCount: myReviewsCount,
      likedTicketsCount: validLikedCount,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("사용자 프로필 조회 실패:", error);
    return NextResponse.json(
      { error: "사용자 프로필 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
