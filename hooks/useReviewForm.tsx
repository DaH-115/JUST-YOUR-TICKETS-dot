import { useRouter } from "next/navigation";
import { db } from "firebase-config";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { addNewReviewAlertHandler } from "store/redux-toolkit/slice/newReviewAlertSlice";
import { ReviewData } from "app/write-review/review-form";
import { firebaseErrorHandler } from "app/utils/firebase-error";
import { useError } from "store/context/error-context";
import { MovieDetails } from "api/fetchMovieDetails";

export const useReviewForm = (
  mode: "create" | "edit",
  movieInfo: MovieDetails,
  movieId: string,
  reviewId?: string,
) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const serializedUser = useAppSelector((state) => state.user.user);
  const { isShowError, isShowSuccess } = useError();

  const onSubmitHandler = async (data: ReviewData) => {
    if (!serializedUser) return;

    try {
      const { reviewTitle, rating, review } = data;

      if (mode === "create") {
        await addDoc(collection(db, "movie-reviews"), {
          userUid: serializedUser.uid,
          userName: serializedUser.displayName,
          movieId,
          reviewTitle,
          rating,
          review,
          date: serverTimestamp(),
          movieTitle: movieInfo.title,
          releaseYear: movieInfo.release_date.slice(0, 4),
          posterImage: movieInfo.poster_path,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (mode === "edit" && reviewId) {
        await updateDoc(doc(db, "movie-reviews", reviewId), {
          reviewTitle,
          rating,
          review,
          updatedAt: serverTimestamp(),
        });
      }

      dispatch(addNewReviewAlertHandler());
      isShowSuccess("알림", "리뷰가 성공적으로 저장되었습니다.", () =>
        router.push("/"),
      );
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      isShowError(title, message);
    }
  };

  return { onSubmitHandler };
};
