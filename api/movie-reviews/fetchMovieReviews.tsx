import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";

export interface MovieReview {
  date: string;
  id: string;
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
  const querySnapshot = await getDocs(collection(db, "movie-reviews"));

  if (querySnapshot.empty) {
    return [];
  }

  const reviews = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MovieReview[];

  return reviews;
}
