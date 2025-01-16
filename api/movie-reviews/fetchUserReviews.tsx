import { db } from "firebase-config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export interface UserReview {
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
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export default async function fetchUserReviews(): Promise<UserReview[]> {
  const movieReviewQuery = query(
    collection(db, "movie-reviews"),
    orderBy("date", "desc"),
  );

  const querySnapshot = await getDocs(movieReviewQuery);

  if (querySnapshot.empty) {
    return [];
  }

  const convertTimestampToString = (timestamp: FirestoreTimestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toISOString();
    }
    return timestamp;
  };

  const totalCount = querySnapshot.size;
  const userReviews = querySnapshot.docs.map((doc, idx) => {
    const review = doc.data();
    return {
      id: doc.id,
      number: totalCount - idx,
      ...review,
      date: convertTimestampToString(review.date),
      updatedAt: convertTimestampToString(review.updatedAt),
      createdAt: convertTimestampToString(review.createdAt),
    };
  }) as UserReview[];

  return userReviews;
}
