import { notFound } from "next/navigation";

import HomePage from "app/home/home-page";
import { fetchMovieCredits } from "lib/movies/fetchMovieCredits";
import { fetchMovieDetails } from "lib/movies/fetchMovieDetails";
import { fetchNowPlayingMovies } from "lib/movies/fetchNowPlayingMovies";
import { fetchTrendingMovies } from "lib/movies/fetchTrendingMovies";
import { fetchVideosMovies } from "lib/movies/fetchVideosMovies";
import { fetchReviewsPaginated } from "lib/reviews/fetchReviewsPaginated";

import { MovieDetailsProvider } from "store/context/movieDetailsContext";


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

  const [trailerData, credits, movieDetails] = await Promise.all([
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
      return { genres: [], certification: null };
    }),
  ]);

  const trailerKey = trailerData?.results?.[0]?.key || "";

  // 추천 영화에 상세 정보 추가
  const recommendMovieWithDetails = {
    ...recommendMovie,
    ...movieDetails,
    genres: movieDetails.genres?.map((g) => g.name) || recommendMovie.genres,
  };

  return (
    <MovieDetailsProvider
      credits={credits}
      genres={recommendMovieWithDetails.genres}
    >
      <HomePage
        movieList={nowPlayingMovies}
        recommendMovie={recommendMovieWithDetails}
        trailerKey={trailerKey}
        trendingMovies={trendingMovies}
        latestReviews={latestReviews}
      />
    </MovieDetailsProvider>
  );
}
