import formatDate from "app/utils/formatDate";
import { db } from "firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { ReviewDoc } from "./fetchReviewsPaginated";

const fetchReviewById = async (reviewId: string): Promise<ReviewDoc | null> => {
  const reviewRef = doc(db, "movie-reviews", reviewId);
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) return null;

  const data = reviewSnap.data();

  return {
    id: reviewSnap.id,
    user: {
      uid: data.user.uid,
      displayName: data.user.displayName,
      photoURL: data.user.photoURL,
      email: data.user.email,
    },
    review: {
      movieId: data.review.movieId,
      movieTitle: data.review.movieTitle,
      originalTitle: data.review.originalTitle,
      moviePosterPath: data.review.moviePosterPath,
      releaseYear: data.review.releaseYear,
      rating: data.review.rating,
      reviewTitle: data.review.reviewTitle,
      reviewContent: data.review.reviewContent,
      createdAt: formatDate(data.review.createdAt),
      updatedAt: formatDate(data.review.updatedAt),
      likeCount: data.review.likeCount,
    },
  };
};

export default fetchReviewById;
