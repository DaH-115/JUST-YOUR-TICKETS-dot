import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { MovieDetailsProvider } from "store/context/movieDetailsContext";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import { fetchTrendingMovies } from "api/fetchTrendingMovies";
import fetchReviews from "api/reviews/fetchReviews";
import HomePage from "app/home/home-page";
import { notFound } from "next/navigation";

export default async function Page() {
  const [nowPlayingMovies, trendingMovies, latestReviews] = await Promise.all([
    fetchNowPlayingMovies().catch((error) => {
      console.error(
        "현재 상영 영화 목록을 불러오는 중 오류가 발생했습니다:",
        error,
      );
      return [];
    }),
    fetchTrendingMovies().catch((error) => {
      console.error("인기 영화 목록을 불러오는 중 오류가 발생했습니다:", error);
      return [];
    }),
    fetchReviews({ limit: 10 }),
  ]);

  if (!nowPlayingMovies?.length) {
    console.error("현재 상영 중인 영화 목록이 비어있습니다.");
    return notFound();
  }

  const MAX_MOVIES = 10;
  const randomIndex = Math.floor(
    Math.random() * Math.min(nowPlayingMovies.length, MAX_MOVIES),
  );
  const recommendMovie = nowPlayingMovies[randomIndex];

  const [trailerData, credits, genreResponse] = await Promise.all([
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
  ]);

  const trailerKey = trailerData?.results?.[0]?.key || "";
  const genres = genreResponse?.genres?.map((genre) => genre.name) || [];

  return (
    <MovieDetailsProvider credits={credits} genres={genres}>
      <HomePage
        movieList={nowPlayingMovies}
        recommendMovie={recommendMovie}
        trailerKey={trailerKey}
        trendingMovies={trendingMovies}
        latestReviews={latestReviews}
      />
    </MovieDetailsProvider>
  );
}
