import { NextResponse } from "next/server";
import { fetchLikedReviewsPaginated } from "lib/reviews/fetchLikedReviewsPaginated";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json(
      { error: "uid 쿼리 파라미터를 반드시 넘겨주세요" },
      { status: 400 },
    );
  }

  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const search = url.searchParams.get("search") || "";

  try {
    const result = await fetchLikedReviewsPaginated({
      uid,
      page,
      pageSize,
      search,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("fetchLikedReviewsPaginated 오류:", error);
    return NextResponse.json(
      { error: error.message || "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
