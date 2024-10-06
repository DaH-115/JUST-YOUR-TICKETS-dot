import { useRouter } from "next/navigation";
import { db } from "firebase-config";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { addNewReviewAlertHandler } from "store/newReviewAlertSlice";
import { Movie } from "app/page";
import { ReviewDate } from "./ReviewForm";

export const useReviewForm = (
  mode: "create" | "edit",
  movieInfo: Movie,
  movieId: string,
  reviewId?: string,
) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user.user);

  const onSubmit = async (data: ReviewDate) => {
    try {
      const { reviewTitle, rating, review } = data;
      const { uid, displayName } = userState;

      if (mode === "create") {
        await addDoc(collection(db, "movie-reviews"), {
          userUid: uid,
          userName: displayName,
          movieId,
          reviewTitle,
          rating,
          review,
          date: new Date().toLocaleDateString(),
          movieTitle: movieInfo.title,
          releaseYear: movieInfo.release_date.slice(0, 4),
          posterImage: movieInfo.poster_path,
        });
      } else if (mode === "edit" && reviewId) {
        await updateDoc(doc(db, "movie-reviews", reviewId), {
          reviewTitle,
          rating,
          review,
          date: new Date().toLocaleDateString(),
        });
      }

      dispatch(addNewReviewAlertHandler());
      router.push("/");
    } catch (e) {
      console.error("Error processing review: ", e);
    }
  };

  return { onSubmit };
};
