import { useRouter } from "next/navigation";
import { db } from "firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "store/redux-toolkit/hooks";
import { addNewReviewAlertHandler } from "store/redux-toolkit/slice/newReviewAlertSlice";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { useAlert } from "store/context/alertContext";
import updateReview from "app/actions/updateReview";
import { ReviewFormValues } from "app/write-review/[id]/page";
import { ReviewContainerProps } from "app/write-review/components/ReviewContainer";

export const useReviewForm = ({
  mode,
  reviewId,
  movieData,
}: ReviewContainerProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.userData.auth);
  const { showErrorHanlder, showSuccessHanlder } = useAlert();

  const onSubmit = async (data: ReviewFormValues) => {
    if (!userState) return;

    try {
      const { reviewTitle, reviewContent, rating } = data;

      if (mode === "new") {
        await addDoc(collection(db, "movie-reviews"), {
          uid: userState.uid,
          userName: userState.displayName,
          movieId: movieData.id,
          movieTitle: movieData.title,
          moviePosterPath: movieData.poster_path,
          releaseYear: movieData.release_date.slice(0, 4),
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

      showSuccessHanlder("알림", "리뷰 티켓이 성공적으로 저장되었습니다.", () =>
        router.push("/"),
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error("리뷰 티켓 생성 중 오류 발생:", error.message);
        showErrorHanlder("오류", error.message);
      } else {
        const { title, message } = firebaseErrorHandler(error);
        showErrorHanlder(title, message);
      }
    }
  };

  return { onSubmit };
};
