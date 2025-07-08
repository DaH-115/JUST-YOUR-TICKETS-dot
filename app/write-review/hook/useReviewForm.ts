import { useRouter } from "next/navigation";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { useAlert } from "store/context/alertContext";
import { ReviewFormValues } from "app/write-review/types";
import { ReviewContainerProps } from "app/write-review/components/ReviewContainer";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";

interface ReviewUserData {
  uid: string | null;
  displayName: string | null;
  photoKey: string | null;
}

interface ReviewApiData {
  user: ReviewUserData;
  review: {
    movieId: number;
    movieTitle: string;
    originalTitle: string;
    moviePosterPath: string | undefined;
    releaseYear: string;
    rating: number;
    reviewTitle: string;
    reviewContent: string;
    likeCount: number;
  };
}

export const useReviewForm = ({
  mode,
  reviewId,
  movieData,
}: ReviewContainerProps) => {
  const router = useRouter();
  const userState = useAppSelector(selectUser);
  const { showErrorHandler, showSuccessHandler, hideSuccessHandler } =
    useAlert();

  const onSubmit = async (data: ReviewFormValues) => {
    if (!userState) return;
    const { reviewTitle, reviewContent, rating } = data;

    try {
      const newData: ReviewApiData = {
        // ✅ 리뷰에 필요한 최소한의 사용자 정보만 전송
        user: {
          uid: userState.uid,
          displayName: userState.displayName,
          photoKey: userState.photoKey,
        },
        review: {
          movieId: movieData.id,
          movieTitle: movieData.title,
          originalTitle: movieData.original_title,
          moviePosterPath: movieData.poster_path,
          releaseYear: movieData.release_date.slice(0, 4),
          rating,
          reviewTitle,
          reviewContent,
          likeCount: 0,
        },
      };

      if (mode === "new") {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify(newData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "생성에 실패했습니다.");
          }

          return response.json();
        });

        showSuccessHandler("알림", "리뷰가 성공적으로 생성되었습니다.", () => {
          hideSuccessHandler();
          router.push("/ticket-list");
          router.refresh(); // 페이지 새로고침으로 최신 데이터 확보
        });
      } else if (mode === "edit" && reviewId) {
        const updateData: ReviewFormValues = {
          reviewTitle,
          reviewContent,
          rating,
        };

        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(`/api/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...authHeaders,
            },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "수정에 실패했습니다.");
          }

          return response.json();
        });

        showSuccessHandler("알림", "리뷰가 성공적으로 수정되었습니다.", () => {
          hideSuccessHandler();
          router.push("/");
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("리뷰 티켓 처리 중 오류 발생:", error.message);
        showErrorHandler("오류", error.message);
      } else {
        const { title, message } = firebaseErrorHandler(error);
        showErrorHandler(title, message);
      }
    }
  };

  return { onSubmit };
};
