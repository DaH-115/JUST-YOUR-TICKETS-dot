import { useRouter } from "next/navigation";
import { db } from "firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { addNewReviewAlertHandler } from "store/redux-toolkit/slice/newReviewAlertSlice";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { useError } from "store/context/errorContext";
import { MovieDetails } from "api/fetchMovieDetails";
import updateReview from "app/actions/updateReview";
import { ReviewFormValues } from "app/write-review/components/ReviewForm";

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

  const onSubmitHandler = async (data: ReviewFormValues) => {
    if (!serializedUser) return;

    try {
      const { reviewTitle, reviewContent, rating } = data;

      if (mode === "create") {
        await addDoc(collection(db, "movie-reviews"), {
          uid: serializedUser.uid,
          userName: serializedUser.displayName,
          movieId,
          movieTitle: movieInfo.title,
          moviePosterPath: movieInfo.poster_path,
          releaseYear: movieInfo.release_date.slice(0, 4),
          rating,
          reviewTitle,
          reviewContent,
          createdAt: serverTimestamp(),
          likeCount: 0,
        });

        dispatch(addNewReviewAlertHandler());
      } else if (mode === "edit" && reviewId) {
        const updateData = {
          reviewTitle,
          reviewContent,
          rating,
        };
        await updateReview(reviewId, updateData);
      }

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
