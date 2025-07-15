import { adminFirestore as db } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function postHandler(req: NextRequest) {
  const authResult = await verifyAuthToken(req);

  if (!authResult.success) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.statusCode },
    );
  }

  const { reviewIds } = (await req.json()) as { reviewIds: string[] };

  if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
    return NextResponse.json(
      { error: "reviewIds must be a non-empty array" },
      { status: 400 },
    );
  }

  const uid = authResult.uid as string;
  const likesPromises = reviewIds.map(async (reviewId) => {
    const likeDoc = await db
      .collection("reviews")
      .doc(reviewId)
      .collection("likes")
      .doc(uid)
      .get();
    return { reviewId, isLiked: likeDoc.exists };
  });

  const likesResults = await Promise.all(likesPromises);

  const likesMap = likesResults.reduce(
    (acc, { reviewId, isLiked }) => {
      acc[reviewId] = isLiked;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  return NextResponse.json({ likes: likesMap });
}
