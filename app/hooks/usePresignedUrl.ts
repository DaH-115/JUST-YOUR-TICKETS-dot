import { useState, useEffect, useRef } from "react";
import { isAuth } from "firebase-config";

// 메모리 내 캐시 (key: S3 key, value: presigned URL)
const presignedUrlCache = new Map<string, string>();

interface UsePresignedUrlProps {
  key?: string | null; // S3에 저장된 파일의 경로
  fallbackUrl?: string; // 로딩 중이거나 에러 시 표시할 기본 URL
}

interface UsePresignedUrlReturn {
  url: string; // 실제 사용할 URL (presigned URL 또는 fallback URL)
  loading: boolean; // presigned URL 요청 진행 상태
  error: string | null; // 에러 메시지
}

export function usePresignedUrl({
  key,
  fallbackUrl,
}: UsePresignedUrlProps): UsePresignedUrlReturn {
  const [url, setUrl] = useState<string>(fallbackUrl || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!key || typeof key !== "string" || key.trim().length === 0) {
      setUrl(fallbackUrl || "");
      setLoading(false);
      setError(null);
      return;
    }

    // 캐시 확인
    if (presignedUrlCache.has(key)) {
      setUrl(presignedUrlCache.get(key)!);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPresignedUrl = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      try {
        // 현재 사용자 확인 및 토큰 가져오기
        const currentUser = isAuth.currentUser;
        if (!currentUser) {
          throw new Error("인증이 필요합니다.");
        }

        const idToken = await currentUser.getIdToken();

        const response = await fetch(`/api/s3?key=${encodeURIComponent(key)}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.message || "Failed to get presigned URL");
        }

        if (!abortController.signal.aborted) {
          presignedUrlCache.set(key, data.url); // 캐시에 저장
          setUrl(data.url);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching presigned URL:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setUrl(fallbackUrl || "");
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPresignedUrl();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [key, fallbackUrl]);

  return { url, loading, error };
}
