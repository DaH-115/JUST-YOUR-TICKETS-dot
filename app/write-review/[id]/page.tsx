"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebase-config";
import { Movie } from "app/page";
import { fetchMovieDetails } from "api/fetchMovieDetails";
import ReviewForm, { ReviewDate } from "app/write-review/ReviewForm";
import Catchphrase from "app/ui/catchphrase";

export default function ReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;
  const movieId = searchParams.get("movieId");
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<ReviewDate>();
  const [movieInfo, setMovieInfo] = useState<Movie>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const fetchMovieInfo = async () => {
        const movieData = await fetchMovieDetails(Number(movieId));
        setMovieInfo(movieData);
      };

      try {
        if (id !== "new" && movieId) {
          // Edit Mode
          const docRef = doc(db, "movie-reviews", id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setInitialData(data as ReviewDate);
          }

          await fetchMovieInfo();
        } else if (id === "new" && movieId) {
          // Create Mode
          await fetchMovieInfo();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, movieId]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ReviewForm
          mode={id === "new" ? "create" : "edit"}
          initialData={initialData}
          movieInfo={movieInfo as Movie}
          movieId={movieId as string}
          reviewId={id as string}
        />
      )}
      <Catchphrase />
    </>
  );
}
