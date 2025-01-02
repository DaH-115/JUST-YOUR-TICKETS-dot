import { db } from "firebase-config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export interface MovieReview {
  date: string;
  id: string;
  number: number;
  movieTitle: string;
  movieId: string;
  posterImage: string;
  rating: number;
  releaseYear: string;
  review: string;
  reviewTitle: string;
  userUid: string;
  userName: string;
}

export default async function fetchMovieReviews(): Promise<MovieReview[]> {
  const movieReviewQuery = query(
    collection(db, "movie-reviews"),
    orderBy("date", "desc"),
  );

  const querySnapshot = await getDocs(movieReviewQuery);

  if (querySnapshot.empty) {
    return [];
  }

  const totalCount = querySnapshot.size;
  const reviews = querySnapshot.docs.map((doc, idx) => ({
    id: doc.id,
    number: totalCount - idx,
    ...doc.data(),
  })) as MovieReview[];

  return reviews;
}
