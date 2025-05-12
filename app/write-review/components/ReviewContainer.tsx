"use client";

import { useReviewData } from "../hook/useReviewData";
import Loading from "app/loading";
import ReviewForm from "./ReviewForm";
import { MovieDetails } from "lib/movies/fetchMovieDetails";

export interface ReviewContainerProps {
  mode: "new" | "edit";
  reviewId?: string;
  movieData: MovieDetails;
}

export default function ReviewContainer({
  mode = "new",
  reviewId,
  movieData,
}: ReviewContainerProps) {
  const { initialData, loading } = useReviewData({
    mode,
    reviewId,
  });

  if (loading) return <Loading />;

  return (
    <ReviewForm
      onSubmitMode={mode}
      initialData={initialData}
      movieData={movieData}
      reviewId={reviewId}
    />
  );
}
