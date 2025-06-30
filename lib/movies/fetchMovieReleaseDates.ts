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

export async function fetchMovieReleaseDates(
  id: number,
): Promise<MovieReleaseDates> {
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

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("알 수 없는 오류가 발생했습니다.");
    }
  }
}

// 등급 정보 정규화 함수
export function normalizeRating(rating: string): string {
  if (!rating || rating.trim() === "") {
    return "18"; // 기본값
  }

  // 대소문자 구분하지 않고 처리
  const normalizedInput = rating.trim();
  const lowerInput = normalizedInput.toLowerCase();

  // 한국 및 국제 등급 매핑 (우선순위: 정확한 매칭 → 소문자 매칭)
  const exactRatingMap: Record<string, string> = {
    // 한국 등급 (TMDB에서 실제 제공되는 형식)
    All: "ALL",
    "12": "12",
    "15": "15",
    "18": "18",
    "Restricted Screening": "RESTRICTED",

    // 미국 등급
    G: "ALL",
    PG: "12",
    "PG-13": "15",
    R: "18",
    "NC-17": "18",
    NR: "18", // Not Rated

    // 기타 국제 등급
    U: "ALL", // 영국
    "12A": "12", // 영국
    "16": "15", // 독일 등
    FSK12: "12", // 독일
    FSK16: "15", // 독일
    FSK18: "18", // 독일

    // 한글 표기
    전체관람가: "ALL",
    "12세관람가": "12",
    "15세관람가": "15",
    "18세관람가": "18",
    제한관람가: "RESTRICTED",
  };

  const lowerRatingMap: Record<string, string> = {
    all: "ALL",
    g: "ALL",
    pg: "12",
    "pg-13": "15",
    r: "18",
    "nc-17": "18",
    nr: "18", // Not Rated
    unrated: "18",
    u: "ALL", // 영국
    "12a": "12", // 영국
    "restricted screening": "RESTRICTED",
    fsk12: "12", // 독일
    fsk16: "15", // 독일
    fsk18: "18", // 독일
  };

  // 1. 정확한 매칭 확인
  if (exactRatingMap[normalizedInput]) {
    return exactRatingMap[normalizedInput];
  }

  // 2. 소문자 매칭 확인
  if (lowerRatingMap[lowerInput]) {
    return lowerRatingMap[lowerInput];
  }

  // 3. 숫자로만 구성된 경우 처리
  const num = parseInt(normalizedInput, 10);
  if (!isNaN(num)) {
    if (num <= 6) return "ALL";
    if (num <= 12) return "12";
    if (num <= 15) return "15";
    if (num >= 16) return "18";
  }

  // 매핑되지 않은 경우 기본값 (프로덕션에서는 로그 출력 안함)
  if (process.env.NODE_ENV === "development") {
    console.warn(`[연령등급] 알 수 없는 연령등급: ${rating}, 기본값(18) 사용`);
  }
  return "18";
}

// 한국 등급 정보만 추출하는 헬퍼 함수
export function getKoreanRating(
  releaseDates: MovieReleaseDates,
): string | null {
  const koreanResult = releaseDates.results.find(
    (result) => result.iso_3166_1 === "KR",
  );

  if (koreanResult && koreanResult.release_dates.length > 0) {
    const rating = koreanResult.release_dates[0].certification;
    if (rating && rating.trim() !== "") {
      return normalizeRating(rating);
    }
  }

  return null;
}

// 미국 등급 정보만 추출하는 헬퍼 함수
export function getUSRating(releaseDates: MovieReleaseDates): string | null {
  const usResult = releaseDates.results.find(
    (result) => result.iso_3166_1 === "US",
  );

  if (usResult && usResult.release_dates.length > 0) {
    return usResult.release_dates[0].certification;
  }

  return null;
}

// 최적 등급 추출 함수 (한국 → 미국 → 기타)
export function getBestRating(releaseDates: MovieReleaseDates): string | null {
  if (
    !releaseDates ||
    !releaseDates.results ||
    releaseDates.results.length === 0
  ) {
    return null;
  }

  // 1. 한국 등급 우선
  const kr = releaseDates.results.find((r) => r.iso_3166_1 === "KR");
  if (kr && kr.release_dates.length > 0) {
    for (const releaseDate of kr.release_dates) {
      if (
        releaseDate.certification &&
        releaseDate.certification.trim() !== ""
      ) {
        const normalized = normalizeRating(releaseDate.certification);
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[연령등급] 한국: ${releaseDate.certification} → ${normalized}`,
          );
        }
        return normalized;
      }
    }
  }

  // 2. 미국 등급
  const us = releaseDates.results.find((r) => r.iso_3166_1 === "US");
  if (us && us.release_dates.length > 0) {
    for (const releaseDate of us.release_dates) {
      if (
        releaseDate.certification &&
        releaseDate.certification.trim() !== ""
      ) {
        const normalized = normalizeRating(releaseDate.certification);
        if (process.env.NODE_ENV === "development") {
          console.log(
            `[연령등급] 미국: ${releaseDate.certification} → ${normalized}`,
          );
        }
        return normalized;
      }
    }
  }

  // 3. 기타 국가 (영국, 독일 등 우선순위)
  const priorityCountries = ["GB", "DE", "FR", "CA", "AU"];
  for (const countryCode of priorityCountries) {
    const country = releaseDates.results.find(
      (r) => r.iso_3166_1 === countryCode,
    );
    if (country && country.release_dates.length > 0) {
      for (const releaseDate of country.release_dates) {
        if (
          releaseDate.certification &&
          releaseDate.certification.trim() !== ""
        ) {
          const normalized = normalizeRating(releaseDate.certification);
          if (process.env.NODE_ENV === "development") {
            console.log(
              `[연령등급] ${countryCode}: ${releaseDate.certification} → ${normalized}`,
            );
          }
          return normalized;
        }
      }
    }
  }

  // 4. 마지막으로 아무거나
  for (const result of releaseDates.results) {
    if (result.release_dates.length > 0) {
      for (const releaseDate of result.release_dates) {
        if (
          releaseDate.certification &&
          releaseDate.certification.trim() !== ""
        ) {
          const normalized = normalizeRating(releaseDate.certification);
          if (process.env.NODE_ENV === "development") {
            console.log(
              `[연령등급] ${result.iso_3166_1}: ${releaseDate.certification} → ${normalized}`,
            );
          }
          return normalized;
        }
      }
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[연령등급] 연령등급 정보를 찾을 수 없습니다.");
  }
  return null;
}
