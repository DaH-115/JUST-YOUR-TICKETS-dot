import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { MovieDetailsProvider } from "store/context/movie-details-context";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import HomePage from "app/home/home-page";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    const nowPlayingMovies = await fetchNowPlayingMovies();

    if (!nowPlayingMovies?.length) {
      return notFound();
    }

    const MAX_MOVIES = 10;
    const randomIndex = Math.floor(
      Math.random() * Math.min(nowPlayingMovies.length, MAX_MOVIES),
    );
    const currentMovie = nowPlayingMovies[randomIndex];

    const [trailerData, credits, genreResponse] = await Promise.all([
      fetchVideosMovies(currentMovie.id).catch(() => {
        throw new Error("예고편 영상을 불러올 수 없습니다.");
      }),
      fetchMovieCredits(currentMovie.id).catch(() => {
        throw new Error("출연진 정보를 불러올 수 없습니다.");
      }),
      fetchMovieDetails(currentMovie.id).catch(() => {
        throw new Error("영화 상세 정보를 불러올 수 없습니다.");
      }),
    ]);

    const videoKey = trailerData?.results?.[0]?.key || "";
    const genres = genreResponse.genres.map((genre) => genre.name);

    return (
      <MovieDetailsProvider credits={credits} genres={genres}>
        <HomePage
          movieList={nowPlayingMovies}
          currentMovie={currentMovie}
          trailerKey={videoKey}
        />
      </MovieDetailsProvider>
    );
  } catch (error) {
    throw new Error("영화를 불러올 수 없습니다");
  }
}
