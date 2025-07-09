import { Metadata } from "next";
import ReviewContainer from "app/write-review/components/ReviewContainer";
import { fetchMovieDetails } from "lib/movies/fetchMovieDetails";

export const metadata: Metadata = {
  title: "New Write Review Ticket",
  description: "새로운 리뷰 티켓을 작성하는 페이지입니다.",
};

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: { movieId?: string };
}) {
  const movieId = Number(searchParams.movieId!);
  const movieData = await fetchMovieDetails(movieId);

  return <ReviewContainer mode="new" movieData={movieData} />;
}
