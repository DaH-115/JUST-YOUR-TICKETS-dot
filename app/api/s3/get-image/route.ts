import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // key 없으면 기본 이미지 사용
  const key = searchParams.get("key") ?? "profile-img/default.png";

  try {
    const { Body, ContentType } = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      }),
    );

    const headers = new Headers();
    headers.set("Content-Type", ContentType ?? "application/octet-stream");

    // ReadableStream을 그대로 반환
    return new NextResponse(Body as ReadableStream, { headers });
  } catch (err: any) {
    console.error("S3 streaming error:", err);
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: err.name === "NoSuchKey" ? 404 : 500 },
    );
  }
}
