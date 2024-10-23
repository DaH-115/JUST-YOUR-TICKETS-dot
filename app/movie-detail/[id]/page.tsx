import { Movie } from "api/fetchNowPlayingMovies";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/back-ground";
import SimilarMovies from "app/movie-detail/similar-movies";
import AllMovieTrailers from "app/movie-detail/all-movie-trailers";
import MovieDetailCard from "app/movie-detail/movie-detail-card";

export default async function MovieDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const movieDetails = await fetchMovieDetails(params.id);
  const movieCredits = await fetchMovieCredits(params.id);
  const { original_title, title, backdrop_path } = movieDetails as Movie;
  const movieTitle = useGetTitle(original_title, title);

  return (
    <>
      <BackGround imageUrl={backdrop_path} movieTitle={movieTitle} />
      <MovieDetailCard
        movieDetails={movieDetails}
        movieCredits={movieCredits}
      />
      {/* Movie Trailer */}
      <AllMovieTrailers movieId={params.id} />
      {/* Similar Movies */}
      <SimilarMovies movieId={params.id} />
    </>
  );
}
