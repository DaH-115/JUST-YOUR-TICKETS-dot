import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { MovieDetailsProvider } from "store/context/movie-details-context";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import HomePage from "app/home/home-page";
import { notFound } from "next/navigation";

export default async function Page() {
  try {
    const { results: nowPlayingMovies } = await fetchNowPlayingMovies();

    if (!nowPlayingMovies?.length) {
      return notFound();
    }

    const randomIndex = Math.floor(
      Math.random() * Math.min(nowPlayingMovies.length, 10),
    );
    const currentMovie = nowPlayingMovies[randomIndex];

    const [trailerData, credits, genreResponse] = await Promise.all([
      fetchVideosMovies(currentMovie.id),
      fetchMovieCredits(currentMovie.id),
      fetchMovieDetails(currentMovie.id),
    ]).catch((error) => {
      throw error;
    });

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
    throw error;
  }
}
