import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { verifyAuthToken } from "lib/auth/verifyToken";
import s3 from "lib/aws/s3";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAuthToken(req);
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.statusCode },
      );
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { message: "key 파라미터가 필요합니다." },
        { status: 400 },
      );
    }

    const ttl = parseInt(process.env.S3_DOWNLOAD_URL_TTL || "3600", 10);
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: ttl });
    return NextResponse.json({ url });
  } catch (err) {
    console.error("S3 download presign error:", err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An unknown error has occurred while creating a presigned URL.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
