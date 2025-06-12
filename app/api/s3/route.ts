import { NextResponse } from "next/server";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

  console.log("🔍 S3 GET Request:", {
    key,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  });

  try {
    const { Body, ContentType } = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
      }),
    );

    if (!Body) {
      console.log("❌ S3 Body is null for key:", key);
      return NextResponse.json(
        { error: true, message: "이미지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    console.log("✅ S3 Body received for key:", key);

    // ReadableStream을 Buffer로 변환
    const chunks: Uint8Array[] = [];
    const reader = Body.transformToWebStream().getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    console.log("✅ Buffer created, size:", buffer.length);

    const headers = new Headers({
      "Content-Type": ContentType ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    return new NextResponse(buffer, { headers });
  } catch (err: any) {
    console.error("❌ S3 streaming error:", {
      message: err.message,
      code: err.name,
      stack: err.stack,
      key,
    });
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: err.name === "NoSuchKey" ? 404 : 500 },
    );
  }
}

// POST: presigned URL 생성
export async function POST(request: Request) {
  const { filename, contentType, userId, action, key } = await request.json();

  // 조회용 presigned URL 생성
  if (action === "download" && key) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });

    try {
      const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 }); // 1시간
      return NextResponse.json({ url });
    } catch (err: any) {
      console.error("S3 download presign error:", err);
      return NextResponse.json(
        { error: true, message: err.message, code: err.name },
        { status: 500 },
      );
    }
  }

  // 업로드용 presigned URL 생성 - 필수 파라미터 검증
  if (!filename || !contentType || !userId) {
    return NextResponse.json(
      {
        error: true,
        message: "filename, contentType, userId 모두 필요합니다.",
      },
      { status: 400 },
    );
  }

  const uploadKey = `profile-img/${userId}/${Date.now()}_${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: uploadKey,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
    return NextResponse.json({ url, key: uploadKey });
  } catch (err: any) {
    console.error("S3 presign error:", err);
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: 500 },
    );
  }
}
