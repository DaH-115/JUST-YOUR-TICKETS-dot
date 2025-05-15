import { NextRequest, NextResponse } from "next/server";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const uid = searchParams.get("uid") ?? undefined;
  const searchTerm = searchParams.get("search")?.trim() || "";

  if (!searchTerm) {
    return NextResponse.json(
      { error: "검색어를 전달해주세요." },
      { status: 400 },
    );
  }

  const data = await fetchReviewsPaginated({
    page,
    pageSize,
    uid,
    search: searchTerm,
  });
  return NextResponse.json(data);
}
