// 캐시 시스템 - Map
const cache = new Map<
  number,
  {
    data: MovieReleaseDates;
    timestamp: number;
  }
>();

export interface ReleaseDate {
  certification: string;
  meaning: string;
  release_date: string;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface MovieReleaseDates {
  id: number;
  results: ReleaseDatesResult[];
}

//캐시 기능
export async function fetchMovieReleaseDates(
  id: number,
): Promise<MovieReleaseDates> {
  // 1단계: 캐시 확인
  const cached = cache.get(id);
  if (cached) {
    // 24시간 안에 가져온 데이터면 재사용
    const oneDay = 24 * 60 * 60 * 1000;
    if (Date.now() - cached.timestamp < oneDay) {
      return cached.data;
    } else {
      // 오래된 데이터는 삭제
      cache.delete(id);
    }
  }

  // 2단계: API 호출
  const TMDB_API_KEY = process.env.TMDB_API_KEY;

  if (!TMDB_API_KEY) {
    throw new Error("TMDB API 키가 설정되지 않았습니다.");
  }

  if (!id || id <= 0) {
    throw new Error("유효하지 않은 영화 ID입니다.");
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 86400 }, // 24시간 캐시
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`영화 ID ${id}에 대한 등급 정보를 찾을 수 없습니다.`);
      } else if (response.status === 401) {
        throw new Error("TMDB API 인증에 실패했습니다.");
      } else if (response.status === 429) {
        throw new Error(
          "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.",
        );
      } else {
        throw new Error(
          `영화 등급 정보를 불러올 수 없습니다. (상태: ${response.status})`,
        );
      }
    }

    const data = await response.json();

    if (!data || !data.results) {
      throw new Error("영화 등급 정보가 올바르지 않습니다.");
    }

    // 3단계: 캐시에 저장
    cache.set(id, {
      data,
      timestamp: Date.now(),
    });

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
}

// 배치 처리 함수
export async function fetchMultipleMovieReleaseDates(
  movieIds: number[],
): Promise<Map<number, MovieReleaseDates | null>> {
  const results = new Map<number, MovieReleaseDates | null>();
  const needAPI = []; // API 호출이 필요한 영화들

  // 1단계: 캐시부터 확인하기
  for (const id of movieIds) {
    const cached = cache.get(id);
    if (cached) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - cached.timestamp < oneDay) {
        results.set(id, cached.data);
        continue; // 다음 영화로!
      }
    }

    // 캐시에 없으면 API 호출 목록에 추가
    needAPI.push(id);
  }

  // 2단계: API 호출이 필요한 것들만 처리
  if (needAPI.length > 0) {
    const promises = needAPI.map(async (id) => {
      try {
        const data = await fetchMovieReleaseDates(id);
        return { id, data, success: true };
      } catch (error) {
        return { id, data: null, success: false };
      }
    });

    // 모든 API 호출이 끝날 때까지 기다리기
    const apiResults = await Promise.all(promises);

    // 결과 정리하기
    for (const result of apiResults) {
      results.set(result.id, result.data);
    }
  }

  return results;
}

// 등급 정규화
export function normalizeRating(rating: string): string {
  if (!rating) return "18";

  const ratingMap: Record<string, string> = {
    All: "ALL",
    "12": "12",
    "15": "15",
    "18": "18",
    G: "ALL",
    PG: "12",
    "PG-13": "15",
    R: "18",
    전체관람가: "ALL",
    "12세관람가": "12",
    "15세관람가": "15",
    "18세관람가": "18",
  };

  return ratingMap[rating.trim()] || "18";
}

// 최적 등급 추출
export function getCertification(
  releaseDates: MovieReleaseDates,
): string | null {
  if (!releaseDates?.results?.length) return null;

  // 한국 등급 우선
  const kr = releaseDates.results.find((r) => r.iso_3166_1 === "KR");
  if (kr?.release_dates?.[0]?.certification) {
    return normalizeRating(kr.release_dates[0].certification);
  }

  // 미국 등급
  const us = releaseDates.results.find((r) => r.iso_3166_1 === "US");
  if (us?.release_dates?.[0]?.certification) {
    return normalizeRating(us.release_dates[0].certification);
  }

  return null;
}

// 유틸리티 함수들
export function clearCache(): void {
  cache.clear();
}

export function getCacheSize(): number {
  return cache.size;
}

export function getCacheStats(): {
  size: number;
  items: Array<{ id: number; timestamp: number; age: string }>;
} {
  const items = Array.from(cache.entries()).map(([id, cached]) => ({
    id,
    timestamp: cached.timestamp,
    age: `${Math.round((Date.now() - cached.timestamp) / 1000 / 60)}분 전`,
  }));

  return {
    size: cache.size,
    items,
  };
}
