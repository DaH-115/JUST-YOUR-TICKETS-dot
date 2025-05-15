import { NextRequest, NextResponse } from "next/server";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const uid = searchParams.get("uid") ?? undefined;

  const data = await fetchReviewsPaginated({ page, pageSize, uid });
  return NextResponse.json(data);
}
