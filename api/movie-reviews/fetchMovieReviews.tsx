import { db } from "firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { ErrorResponse } from "api/error-type";
import { firebaseErrorHandler } from "app/my-page/utils/firebase-error";

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

type FetchMovieReviewsResult = MovieReview[] | ErrorResponse;

export default async function fetchMovieReviews(): Promise<FetchMovieReviewsResult> {
  try {
    const querySnapshot = await getDocs(collection(db, "movie-reviews"));

    if (!querySnapshot.empty) {
      const reviews = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MovieReview[];

      return reviews;
    } else {
      return {
        title: "데이터 없음",
        errorMessage: "등록된 리뷰가 없습니다.",
        status: 404,
      };
    }
  } catch (error) {
    const { title, message } = firebaseErrorHandler(error);
    return {
      title,
      errorMessage: message,
    };
  }
}
