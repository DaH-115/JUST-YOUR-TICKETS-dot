"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebase-config";
import { fetchMovieDetails, MovieDetails } from "api/fetchMovieDetails";
import ReviewForm, { ReviewData } from "app/write-review/review-form";
import Catchphrase from "app/ui/catchphrase";
import ReviewFormSkeleton from "app/write-review/review-form-skeleton";
import { firebaseErrorHandler } from "app/utils/firebase-error";

export default function WriteReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const movieId = searchParams.get("movieId");
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<ReviewData>();
  const [movieInfo, setMovieInfo] = useState<MovieDetails>();

  useEffect(() => {
    if (!movieId) return;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const movieData = await fetchMovieDetails(Number(movieId));
        setMovieInfo(movieData);
      } catch (error) {
        const { title, message } = firebaseErrorHandler(error);
        window.alert(`${title}: ${message}`);
      }

      if (id !== "new") {
        // Edit Mode
        try {
          const docRef = doc(db, "movie-reviews", id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setInitialData(data as ReviewData);
          }
        } catch (error) {
          const { title, message } = firebaseErrorHandler(error);
          window.alert(`${title}: ${message}`);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [id, movieId]);

  return (
    <>
      {isLoading ? (
        <ReviewFormSkeleton />
      ) : (
        <ReviewForm
          mode={id === "new" ? "create" : "edit"}
          initialData={initialData}
          movieInfo={movieInfo as MovieDetails}
          movieId={movieId as string}
          reviewId={id}
        />
      )}
      <Catchphrase />
    </>
  );
}
