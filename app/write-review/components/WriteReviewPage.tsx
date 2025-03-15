"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebase-config";
import { fetchMovieDetails, MovieDetails } from "api/fetchMovieDetails";
import ReviewForm, {
  ReviewFormValues,
} from "app/write-review/components/ReviewForm";
import { firebaseErrorHandler } from "app/utils/firebaseError";

export default function WriteReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const movieId = searchParams.get("movieId");
  const [initialData, setInitialData] = useState<ReviewFormValues>();
  const [movieInfo, setMovieInfo] = useState<MovieDetails>();

  useEffect(() => {
    if (!movieId) return;

    const fetchData = async () => {
      try {
        const movieData = await fetchMovieDetails(Number(movieId));
        setMovieInfo(movieData);
      } catch (error) {
        window.alert(
          "영화 정보를 불러오는데 실패했습니다. 다시 시도해 주세요.",
        );
      }

      if (id !== "new") {
        // Edit Mode
        try {
          const docRef = doc(db, "movie-reviews", id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setInitialData(data as ReviewFormValues);
          }
        } catch (error) {
          const { title, message } = firebaseErrorHandler(error);
          window.alert(`${title}: ${message}`);
        }
      }
    };

    fetchData();
  }, [id, movieId]);

  return (
    <ReviewForm
      mode={id === "new" ? "create" : "edit"}
      initialData={initialData}
      movieInfo={movieInfo as MovieDetails}
      movieId={movieId as string}
      reviewId={id}
    />
  );
}
