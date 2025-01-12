import { db } from "firebase-config";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

export interface MovieReview {
  date: Timestamp;
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  const reviews = querySnapshot.docs.map((doc, idx) => {
    const data = doc.data();

    return {
      id: doc.id,
      number: totalCount - idx,
      ...data,
    };
  }) as MovieReview[];

  return reviews;
}
