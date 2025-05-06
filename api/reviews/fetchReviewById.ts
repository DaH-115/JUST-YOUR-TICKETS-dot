import { db } from "firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { Review } from "api/reviews/fetchReviews";

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

const convertTimestampToString = (
  timestamp: FirestoreTimestamp | undefined,
): string => {
  return timestamp?.seconds
    ? new Date(timestamp.seconds * 1000).toISOString()
    : "";
};

const fetchReviewById = async (reviewId: string): Promise<Review | null> => {
  const reviewRef = doc(db, "movie-reviews", reviewId);
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) return null;

  const data = reviewSnap.data();

  return {
    id: reviewSnap.id,
    uid: data.uid,
    userName: data.userName,
    movieId: data.movieId,
    movieTitle: data.movieTitle,
    moviePosterPath: data.moviePosterPath,
    releaseYear: data.releaseYear,
    rating: data.rating,
    reviewTitle: data.reviewTitle,
    reviewContent: data.reviewContent,
    likeCount: data.likeCount ?? 0,
    createdAt: convertTimestampToString(data.createdAt),
  };
};

export default fetchReviewById;
