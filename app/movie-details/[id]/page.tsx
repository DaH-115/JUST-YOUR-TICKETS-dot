import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import { fetchVideosMovies } from "api/fetchVideosMovies";
import { fetchSimilarMovies } from "api/fetchSimilarMovies";
import getMovieTitle from "app/utils/get-movie-title";
import BackGround from "app/ui/layout/back-ground";
import SimilarMovies from "app/movie-details/similar-movies";
import AllMovieTrailers from "app/movie-details/all-movie-trailers";
import MovieDetailCard from "app/movie-details/movie-detail-card";

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  try {
    const movieDetails = await fetchMovieDetails(params.id);
    const { original_title, title, backdrop_path, overview } = movieDetails;
    const movieTitle = getMovieTitle(original_title, title);

    return {
      alternates: {
        canonical: `/movie-details/${params.id}`,
      },
      title: movieTitle,
      description: overview,
      openGraph: {
        images: backdrop_path
          ? [
              {
                url: `https://image.tmdb.org/t/p/original${backdrop_path}`,
              },
            ]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "오류",
      description: "요청하신 영화 정보를 불러오는데 실패했습니다.",
    };
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: { id: number };
}) {
  const movieDetails = await fetchMovieDetails(params.id);
  const movieCredits = await fetchMovieCredits(params.id);
  const { results: movieTrailer } = await fetchVideosMovies(params.id);
  const similarMovies = await fetchSimilarMovies(params.id);

  if (!params.id) {
    notFound();
  }

  const { original_title, title, backdrop_path } = movieDetails;
  const movieTitle = getMovieTitle(original_title, title);

  return (
    <>
      <BackGround imageUrl={backdrop_path || ""} movieTitle={movieTitle} />
      <MovieDetailCard
        movieDetails={movieDetails}
        movieCredits={movieCredits}
      />
      <AllMovieTrailers movieTrailer={movieTrailer} />
      <SimilarMovies similarMovies={similarMovies} />
    </>
  );
}
