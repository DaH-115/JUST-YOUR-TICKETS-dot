import { useState, useEffect, useCallback, useRef } from "react";

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
  fallbackUrl = "/images/fallback-avatar.svg",
}: UsePresignedUrlProps): UsePresignedUrlReturn {
  // 현재 표시할 URL (presigned URL 또는 fallback URL)
  const [url, setUrl] = useState<string>(fallbackUrl);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // HTTP 요청 취소를 위한 AbortController 참조
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // key 유효성 검증
    if (!key || typeof key !== "string" || key.trim().length === 0) {
      // 유효하지 않은 key인 경우 즉시 fallback URL 사용
      setUrl(fallbackUrl);
      setLoading(false);
      setError(null);
      return;
    }

    /**
     * S3 presigned URL을 요청하는 함수
     *
     * 동작 과정:
     * 1. 이전 요청이 있다면 취소
     * 2. 새로운 AbortController 생성
     * 3. GET /api/s3?key={s3Key} 요청
     * 4. 응답 검증 및 URL 설정
     * 5. 에러 처리 및 fallback URL 설정
     */
    const fetchPresignedUrl = async () => {
      // 1. 이전 요청 취소 (중복 요청 방지)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 2. 새로운 요청을 위한 AbortController 생성
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // 3. 로딩 상태 시작 및 에러 초기화
      setLoading(true);
      setError(null);

      try {
        // 4. RESTful GET 요청으로 presigned URL 요청
        const response = await fetch(`/api/s3?key=${encodeURIComponent(key)}`, {
          method: "GET",
          signal: abortController.signal, // 요청 취소를 위한 signal
        });

        // 5. HTTP 응답 상태 확인
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 6. JSON 응답 파싱
        const data = await response.json();

        // 7. API 에러 응답 확인
        if (data.error) {
          throw new Error(data.message || "Failed to get presigned URL");
        }

        // 8. 요청이 취소되지 않았을 때만 상태 업데이트
        if (!abortController.signal.aborted) {
          setUrl(data.url);
        }
      } catch (err) {
        // 9. 요청 취소가 아닌 실제 에러인 경우에만 처리
        if (!abortController.signal.aborted) {
          console.error("Error fetching presigned URL:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setUrl(fallbackUrl); // 에러 시 fallback URL로 복원
        }
      } finally {
        // 10. 로딩 상태 종료 (요청이 취소되지 않은 경우만)
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // 유효한 key인 경우 presigned URL 요청
    fetchPresignedUrl();

    // cleanup: 컴포넌트 언마운트 또는 key 변경 시 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [key, fallbackUrl]);

  return { url, loading, error };
}
