import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { adminFirestore } from "firebase-admin-config";
import { verifyAuthToken, verifyResourceOwnership } from "lib/auth/verifyToken";
import { fetchMovieDetails, MovieDetails } from "lib/movies/fetchMovieDetails";

/**
 * 사용자의 보고 싶은 영화 목록을 조회하는 API (영화 상세 정보 포함)
 * @param req - NextRequest 객체
 * @returns 보고 싶은 영화 목록 (영화 상세 정보 포함) 또는 에러 응답
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");

  // uid 쿼리 파라미터 검증
  if (!uid) {
    return NextResponse.json(
      { error: "uid 쿼리 파라미터가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    // 인증 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    // 리소스 소유권 검증 (본인의 보고 싶은 영화만 조회 가능)
    const ownership = verifyResourceOwnership(authResult.uid!, uid);
    if (!ownership.success) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.statusCode || 403 },
      );
    }

    // Firestore에서 해당 사용자의 보고 싶은 영화 목록 조회 (최신순 정렬)
    const snap = await adminFirestore
      .collection("watchlists")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .get();

    const watchlistData = snap.docs.map((doc) => doc.data());
    const movieIds = watchlistData.map((item) => item.movieId);

    // 영화 상세 정보 가져오기
    let movies: MovieDetails[] = [];
    if (movieIds.length > 0) {
      try {
        movies = await Promise.all(
          movieIds.map(async (movieId) => {
            return await fetchMovieDetails(movieId);
          }),
        );
      } catch (error) {
        console.error("영화 상세 정보 조회 실패:", error);
        // 영화 상세 정보 조회 실패 시에도 기본 정보는 반환
        movies = movieIds.map((movieId) => ({
          id: movieId,
          title: "영화 정보를 불러올 수 없습니다",
          original_title: "영화 정보를 불러올 수 없습니다",
          overview: "",
          poster_path: undefined,
          backdrop_path: undefined,
          release_date: "",
          vote_average: 0,
          runtime: "",
          production_companies: [],
          genres: [],
          certification: null,
        }));
      }
    }

    return NextResponse.json({ movies });
  } catch (err) {
    console.error("워치리스트 조회 실패:", err);
    return NextResponse.json(
      { error: "워치리스트를 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

/**
 * 영화를 보고 싶은 영화 목록에 추가하는 API
 * @param req - NextRequest 객체 (uid, movieId 포함)
 * @returns 성공 또는 에러 응답
 */
export async function POST(req: NextRequest) {
  try {
    // 인증 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const { uid, movieId } = await req.json();

    // 필수 파라미터 검증
    if (!uid || !movieId) {
      return NextResponse.json(
        { error: "uid와 movieId가 필요합니다." },
        { status: 400 },
      );
    }

    // 리소스 소유권 검증 (본인의 보고 싶은 영화만 추가 가능)
    const ownership = verifyResourceOwnership(authResult.uid!, uid);
    if (!ownership.success) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.statusCode || 403 },
      );
    }

    // Firestore에 보고 싶은 영화 정보 저장 (uid_movieId 조합으로 고유 문서 생성)
    await adminFirestore.collection("watchlists").doc(`${uid}_${movieId}`).set({
      uid,
      movieId,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 찜한 영화 페이지 캐시 무효화
    // 보고 싶은 영화 페이지 캐시 무효화
    revalidatePath("/my-page/watchlist");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("워치리스트 추가 실패:", err);
    return NextResponse.json(
      { error: "워치리스트 추가에 실패했습니다." },
      { status: 500 },
    );
  }
}

/**
 * 보고 싶은 영화 목록에서 영화를 제거하는 API
 * @param req - NextRequest 객체 (uid, movieId 포함)
 * @returns 성공 또는 에러 응답
 */
export async function DELETE(req: NextRequest) {
  try {
    // 인증 토큰 검증
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode || 401 },
      );
    }

    const { uid, movieId } = await req.json();

    // 필수 파라미터 검증
    if (!uid || !movieId) {
      return NextResponse.json(
        { error: "uid와 movieId가 필요합니다." },
        { status: 400 },
      );
    }

    // 리소스 소유권 검증 (본인의 보고 싶은 영화만 삭제 가능)
    const ownership = verifyResourceOwnership(authResult.uid!, uid);
    if (!ownership.success) {
      return NextResponse.json(
        { error: ownership.error },
        { status: ownership.statusCode || 403 },
      );
    }

    // Firestore에서 보고 싶은 영화 정보 삭제
    await adminFirestore
      .collection("watchlists")
      .doc(`${uid}_${movieId}`)
      .delete();

    // 보고 싶은 영화 페이지 캐시 무효화
    revalidatePath("/my-page/watchlist");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("워치리스트 삭제 실패:", err);
    return NextResponse.json(
      { error: "워치리스트 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
