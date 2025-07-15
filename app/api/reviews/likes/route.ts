import { NextRequest, NextResponse } from "next/server";
import { postHandler } from "./post.handler";

export async function POST(req: NextRequest) {
  try {
    const response = await postHandler(req);
    return response;
  } catch (error) {
    console.error("Error in POST /api/reviews/likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
