import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { MovieDetailsProvider } from "store/context/movie-details-context";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import HomePage from "app/home/home-page";

export default async function Page() {
  const { results: nowPlayingMovies } = await fetchNowPlayingMovies();
  const randomIndex = Math.floor(Math.random() * 10);
  const trailerData = await fetchVideosMovies(nowPlayingMovies[randomIndex].id);
  const currentMovie = nowPlayingMovies[randomIndex];
  const videoKey = trailerData?.results?.[0]?.key ?? "";
  const credits = await fetchMovieCredits(currentMovie.id);
  const genreResponse = await fetchMovieDetails(currentMovie.id);
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
