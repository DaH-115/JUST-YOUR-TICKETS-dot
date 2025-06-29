import { notFound } from "next/navigation";

import { fetchNowPlayingMovies } from "lib/movies/fetchNowPlayingMovies";
import { fetchMovieCredits } from "lib/movies/fetchMovieCredits";
import { fetchMovieDetails } from "lib/movies/fetchMovieDetails";
import { fetchVideosMovies } from "lib/movies/fetchVideosMovies";
import { fetchTrendingMovies } from "lib/movies/fetchTrendingMovies";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";
import {
  fetchMovieReleaseDates,
  getKoreanRating,
} from "lib/movies/fetchMovieReleaseDates";

import { MovieDetailsProvider } from "store/context/movieDetailsContext";

import HomePage from "app/home/home-page";

export default async function Page() {
  const [nowPlayingMovies, trendingMovies, { reviews: latestReviews }] =
    await Promise.all([
      fetchNowPlayingMovies().catch((error) => {
        console.error(
          "현재 상영 영화 목록을 불러오는 중 오류가 발생했습니다:",
          error,
        );
        return [];
      }),
      fetchTrendingMovies().catch((error) => {
        console.error(
          "인기 영화 목록을 불러오는 중 오류가 발생했습니다:",
          error,
        );
        return [];
      }),
      fetchReviewsPaginated({ page: 1, pageSize: 10 }),
    ]);

  if (!nowPlayingMovies?.length) {
    console.error("현재 상영 중인 영화 목록이 비어있습니다.");
    return notFound();
  }

  // 오늘 날짜로 1~10 사이에서 "랜덤" 선택 (매일 다른 영화)
  const today = new Date().getDate(); // 1~31
  const randomLikeIndex = today % 10; // 0~9
  const recommendMovie =
    nowPlayingMovies[randomLikeIndex] || nowPlayingMovies[0];

  const [trailerData, credits, genreResponse, releaseDates] = await Promise.all(
    [
      fetchVideosMovies(recommendMovie.id).catch((error) => {
        console.error(
          `영화 ID ${recommendMovie.id}의 예고편 영상을 불러오는 중 오류가 발생했습니다:`,
          error,
        );
        return { results: [] };
      }),
      fetchMovieCredits(recommendMovie.id).catch((error) => {
        console.error(
          `영화 ID ${recommendMovie.id}의 출연진 정보를 불러오는 중 오류가 발생했습니다:`,
          error,
        );
        return { cast: [], crew: [] };
      }),
      fetchMovieDetails(recommendMovie.id).catch((error) => {
        console.error(
          `영화 ID ${recommendMovie.id}의 상세 정보를 불러오는 중 오류가 발생했습니다:`,
          error,
        );
        return { genres: [] };
      }),
      fetchMovieReleaseDates(recommendMovie.id).catch((error) => {
        console.error(
          `영화 ID ${recommendMovie.id}의 등급 정보를 불러오는 중 오류가 발생했습니다:`,
          error,
        );
        return { id: recommendMovie.id, results: [] };
      }),
    ],
  );

  const trailerKey = trailerData?.results?.[0]?.key || "";
  const genres = genreResponse?.genres?.map((genre) => genre.name) || [];

  // 추천 영화에 한국 등급 정보 추가
  const recommendMovieWithRating = {
    ...recommendMovie,
    koreanRating: getKoreanRating(releaseDates),
  };

  return (
    <MovieDetailsProvider credits={credits} genres={genres}>
      <HomePage
        movieList={nowPlayingMovies}
        recommendMovie={recommendMovieWithRating}
        trailerKey={trailerKey}
        trendingMovies={trendingMovies}
        latestReviews={latestReviews}
      />
    </MovieDetailsProvider>
  );
}
