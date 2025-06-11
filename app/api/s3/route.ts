import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Edge Runtime 제거 - Node.js Runtime 사용
// export const runtime = "edge";

// S3Client를 파일 최상단에서 한 번만 생성
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// GET: 이미지 스트리밍
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key") ?? "profile-img/default.png";

  try {
    const { Body, ContentType } = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      }),
    );

    if (!Body) {
      return NextResponse.json(
        { error: true, message: "이미지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // ReadableStream을 Buffer로 변환
    const chunks: Uint8Array[] = [];
    const reader = Body.transformToWebStream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    const headers = new Headers({
      "Content-Type": ContentType ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return new NextResponse(buffer, { headers });
  } catch (err: any) {
    console.error("S3 streaming error:", err);
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: err.name === "NoSuchKey" ? 404 : 500 },
    );
  }
}

// POST: presigned URL 생성
export async function POST(request: Request) {
  const { filename, contentType, userId } = await request.json();

  if (!filename || !contentType || !userId) {
    return NextResponse.json(
      {
        error: true,
        message: "filename, contentType, userId 모두 필요합니다.",
      },
      { status: 400 },
    );
  }

  const key = `profile-img/${userId}/${Date.now()}_${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
    return NextResponse.json({ url, key });
  } catch (err: any) {
    console.error("S3 presign error:", err);
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: 500 },
    );
  }
}
