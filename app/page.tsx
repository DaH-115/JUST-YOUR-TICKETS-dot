import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { MovieDetailsProvider } from "store/context/movie-details-context";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import HomePage from "app/home/home-page";
import { notFound } from "next/navigation";

export default async function Page() {
  const { results: nowPlayingMovies } = await fetchNowPlayingMovies();

  if (!nowPlayingMovies) {
    return notFound();
  }

  const randomIndex = Math.floor(
    nowPlayingMovies.length <= 10
      ? Math.random() * 10
      : Math.random() * nowPlayingMovies.length,
  );
  const currentMovie = nowPlayingMovies[randomIndex];
  const [trailerData, credits, genreResponse] = await Promise.all([
    fetchVideosMovies(currentMovie.id),
    fetchMovieCredits(currentMovie.id),
    fetchMovieDetails(currentMovie.id),
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
}
