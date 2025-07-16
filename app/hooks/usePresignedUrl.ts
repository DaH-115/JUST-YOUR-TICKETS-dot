import { useState, useEffect, useRef } from "react";
import { isAuth } from "firebase-config";
import { useAuth } from "store/context/auth/authContext";

// 메모리 내 캐시 (key: S3 key, value: presigned URL)
const presignedUrlCache = new Map<string, string>();

interface UsePresignedUrlProps {
  key?: string | null; // S3에 저장된 파일의 경로
  fallbackUrl?: string; // 로딩 중이거나 에러 시 표시할 기본 URL
  isPublic?: boolean; // 공개 리소스 여부. true이면 인증 없이 요청
}

interface UsePresignedUrlReturn {
  url: string; // 실제 사용할 URL (presigned URL 또는 fallback URL)
  loading: boolean; // presigned URL 요청 진행 상태
  error: string | null; // 에러 메시지
}

export function usePresignedUrl({
  key,
  fallbackUrl,
  isPublic = false,
}: UsePresignedUrlProps): UsePresignedUrlReturn {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [url, setUrl] = useState<string>(fallbackUrl || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // 공개 리소스가 아닌 경우에만 인증 상태 로딩을 기다림
    if (!isPublic && isAuthLoading) {
      setLoading(true);
      return;
    }

    if (!key || typeof key !== "string" || key.trim().length === 0) {
      setUrl(fallbackUrl || "");
      setLoading(false);
      setError(null);
      return;
    }

    // 공개 리소스가 아니고, 인증도 안 된 경우
    if (!isPublic && !isAuthenticated) {
      setError("인증이 필요합니다.");
      setUrl(fallbackUrl || "");
      setLoading(false);
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
        const idToken =
          !isPublic && isAuth.currentUser
            ? await isAuth.currentUser.getIdToken()
            : null;

        // 공개 리소스가 아니고, 토큰도 없는 경우
        if (!isPublic && !idToken) {
          throw new Error("인증 토큰을 가져올 수 없습니다.");
        }

        const headers: HeadersInit = idToken
          ? { Authorization: `Bearer ${idToken}` }
          : {};

        const apiUrl = isPublic
          ? `/api/s3?key=${encodeURIComponent(key)}&isPublic=true`
          : `/api/s3?key=${encodeURIComponent(key)}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers,
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
  }, [key, fallbackUrl, isAuthenticated, isAuthLoading, isPublic]);

  return { url, loading, error };
}
