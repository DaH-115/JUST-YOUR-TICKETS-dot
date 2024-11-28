import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApiError } from "api/error-type";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import { fetchMovieCredits } from "api/fetchMovieCredits";
import useGetTitle from "hooks/useGetTitle";
import BackGround from "app/ui/back-ground";
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
    const movieTitle = useGetTitle(original_title, title);

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
    const apiError = error as ApiError;
    return {
      title: "영화 정보를 찾을 수 없습니다",
      description:
        apiError.message || "요청하신 영화 정보를 불러오는데 실패했습니다.",
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

  if (!movieDetails) {
    notFound();
  }

  const { original_title, title, backdrop_path } = movieDetails;
  const movieTitle = useGetTitle(original_title, title);

  return (
    <>
      <BackGround imageUrl={backdrop_path || ""} movieTitle={movieTitle} />
      <MovieDetailCard
        movieDetails={movieDetails}
        movieCredits={movieCredits}
      />
      <AllMovieTrailers movieId={params.id} />
      <SimilarMovies movieId={params.id} />
    </>
  );
}
