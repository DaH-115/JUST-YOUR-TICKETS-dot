import { NextResponse } from "next/server";
import { fetchLikedReviewsPaginated } from "lib/reviews/fetchLikedReviewsPaginated";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const search = url.searchParams.get("search") || "";

  const result = await fetchLikedReviewsPaginated({
    uid,
    page,
    pageSize,
    search,
  });
  return NextResponse.json(result);
}
