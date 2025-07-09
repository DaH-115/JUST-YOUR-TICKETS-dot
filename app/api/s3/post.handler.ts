import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

// S3Client를 파일 최상단에서 한 번만 생성하여 재사용
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * POST: 파일 업로드용 presigned URL 생성
 *
 * Request Body:
 * - filename: 업로드할 파일명
 * - contentType: 파일의 MIME 타입
 * - userId: 사용자 ID
 *
 * @param request - 요청 객체
 * @returns 업로드용 presigned URL과 파일 key
 */
export async function POST(request: Request) {
  const { filename, contentType, userId } = await request.json();

  // 1. 필수 파라미터 검증
  if (!filename || !contentType || !userId) {
    return NextResponse.json(
      {
        error: true,
        message: "filename, contentType, userId 모두 필요합니다.",
      },
      { status: 400 },
    );
  }

  // 2. S3에 저장될 고유한 파일 경로 생성
  // 형식: profile-img/{userId}/{timestamp}_{원본파일명}
  const uploadKey = `profile-img/${userId}/${Date.now()}_${filename}`;

  // 3. S3에 파일을 업로드하는 명령 생성
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: uploadKey, // S3에 저장될 파일 경로
    ContentType: contentType, // 파일의 MIME 타입
  });

  try {
    // 4. 5분간 유효한 업로드용 presigned URL 생성
    const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5분

    // 5. presigned URL과 파일 key를 함께 반환
    // - url: 클라이언트가 파일을 업로드할 수 있는 임시 URL
    // - key: 업로드 후 S3에서 파일에 접근할 때 사용할 경로
    return NextResponse.json({ url, key: uploadKey });
  } catch (err: any) {
    console.error("S3 presign error:", err);
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: 500 },
    );
  }
}
