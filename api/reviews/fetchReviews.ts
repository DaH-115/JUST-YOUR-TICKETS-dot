import { db } from "firebase-config";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";

export interface Review {
  number?: number;
  id: string;
  uid: string;
  userName: string;
  movieId: string;
  movieTitle: string;
  moviePosterPath: string;
  releaseYear: string;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
  createdAt: string;
  likeCount: number;
}

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

interface FetchReviewsOptions {
  uid?: string;
  limit?: number;
}

export default async function fetchReviews(
  options: FetchReviewsOptions = {},
): Promise<Review[]> {
  const { uid, limit: limitCount } = options;
  const reviewsRef = collection(db, "movie-reviews");

  let reviewQuery = query(reviewsRef, orderBy("createdAt", "desc"));

  if (uid) {
    reviewQuery = query(reviewQuery, where("uid", "==", uid));
  }

  if (limitCount) {
    reviewQuery = query(reviewQuery, limit(limitCount));
  }

  const querySnapshot = await getDocs(reviewQuery);

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
  const reviews = querySnapshot.docs.map((doc, idx) => {
    const review = doc.data();
    return {
      id: doc.id,
      number: totalCount - idx,
      uid: review.uid,
      userName: review.userName,
      movieId: review.movieId,
      movieTitle: review.movieTitle,
      moviePosterPath: review.moviePosterPath,
      releaseYear: review.releaseYear,
      rating: review.rating,
      reviewTitle: review.reviewTitle,
      reviewContent: review.reviewContent,
      createdAt: convertTimestampToString(review.createdAt),
      likeCount: review.likeCount,
    } as Review;
  });

  return reviews;
}
