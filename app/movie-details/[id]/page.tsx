import { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieDetailCard from "app/movie-details/components/MovieDetails";
import AllMovieTrailers from "app/movie-details/components/MovieTrailers";
import SimilarMovies from "app/movie-details/components/SimilarMovies";
import Background from "app/components/ui/layout/Background";
import getMovieTitle from "app/utils/getMovieTitle";
import { fetchMovieCredits } from "lib/movies/fetchMovieCredits";
import { fetchMovieDetails } from "lib/movies/fetchMovieDetails";
import { fetchSimilarMovies } from "lib/movies/fetchSimilarMovies";
import { fetchVideosMovies } from "lib/movies/fetchVideosMovies";

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  if (!params.id) {
    return {
      title: "잘못된 접근",
      description: "올바르지 않은 영화 ID입니다.",
    };
  }

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
  } catch (error: unknown) {
    console.error("메타데이터 생성 실패:", error);
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
  if (!params.id) {
    return notFound();
  }

  try {
    const movieDetails = await fetchMovieDetails(params.id);
    if (!movieDetails) {
      return notFound();
    }

    const [movieCredits, movieTrailerData, similarMovies] = await Promise.all([
      fetchMovieCredits(params.id),
      fetchVideosMovies(params.id),
      fetchSimilarMovies(params.id),
    ]);

    const { backdrop_path } = movieDetails;

    return (
      <>
        <Background imageUrl={backdrop_path || ""} />
        <MovieDetailCard
          movieDetails={movieDetails}
          movieCredits={movieCredits}
        />
        <AllMovieTrailers movieTrailer={movieTrailerData.results} />
        <SimilarMovies similarMovies={similarMovies} />
      </>
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    return notFound();
  }
}
