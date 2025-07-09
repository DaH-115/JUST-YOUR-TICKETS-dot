import { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieDetailCard from "app/movie-details/components/MovieDetails";
import AllMovieTrailers from "app/movie-details/components/MovieTrailers";
import SimilarMovies from "app/movie-details/components/SimilarMovies";
import Background from "app/ui/layout/Background";
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
  if (!params.id) {
    return notFound();
  }

  try {
    const [movieDetails, movieCredits, movieTrailerData, similarMovies] =
      await Promise.all([
        fetchMovieDetails(params.id),
        fetchMovieCredits(params.id),
        fetchVideosMovies(params.id),
        fetchSimilarMovies(params.id),
      ]).catch((error) => {
        if (error.message.includes("TMDB API 키가 설정되지 않았습니다")) {
          throw new Error("서버 설정 오류가 발생했습니다.");
        }
        throw error;
      });

    if (!movieDetails || !movieCredits) {
      return notFound();
    }

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
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    return notFound();
  }
}
