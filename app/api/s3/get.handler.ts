import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3Client를 파일 최상단에서 한 번만 생성하여 재사용
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * GET: 파일 다운로드용 presigned URL 생성
 *
 * Query Parameters:
 * - key: S3에 저장된 파일의 경로
 *
 * @param request - 요청 객체
 * @returns 다운로드용 presigned URL
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  // 1. 필수 파라미터 검증
  if (!key) {
    return NextResponse.json(
      {
        error: true,
        message: "key 파라미터가 필요합니다.",
      },
      { status: 400 },
    );
  }

  // 2. TTL 설정 (환경 변수 또는 기본 1시간)
  const ttl = parseInt(process.env.S3_DOWNLOAD_URL_TTL || "3600", 10);

  // 3. S3에서 파일을 가져오는 명령 생성
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key, // S3에 저장된 파일의 경로
  });

  try {
    // 4. 환경 변수로 설정된 TTL로 다운로드용 presigned URL 생성
    const url = await getSignedUrl(s3, command, { expiresIn: ttl });
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error("S3 download presign error:", err);
    return NextResponse.json(
      { error: true, message: err.message, code: err.name },
      { status: 500 },
    );
  }
}
