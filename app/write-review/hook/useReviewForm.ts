import { useRouter } from "next/navigation";
import { firebaseErrorHandler } from "app/utils/firebaseError";
import { ReviewContainerProps } from "app/write-review/components/ReviewContainer";
import { ReviewFormValues } from "app/write-review/types";
import { useAlert } from "store/context/alertContext";
import { useAppSelector, useAppDispatch } from "store/redux-toolkit/hooks";
import {
  selectUser,
  fetchUserProfile,
} from "store/redux-toolkit/slice/userSlice";
import { useLevelUpCheck } from "app/write-review/hook/useLevelUpCheck";
import { useState, useRef } from "react";
import { postReview } from "app/utils/api/postReview";
import { putReview } from "app/utils/api/putReview";
import type { ReviewApiData } from "app/utils/api/postReview";
import { getIdToken } from "app/utils/getIdToken/getIdToken";

// 리뷰 작성/수정 폼의 비즈니스 로직(상태, API, 등급 변화, Alert 등)을 담당하는 커스텀 훅
export const useReviewForm = ({
  mode,
  reviewId,
  movieData,
}: ReviewContainerProps) => {
  const router = useRouter();
  const userState = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const { showErrorHandler, showSuccessHandler, hideSuccessHandler } =
    useAlert();
  // 등급 변화 감지 상태 (내부에서만 사용)
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  // 현재 등급 상태
  const [currentLevel, setCurrentLevel] = useState(
    userState?.activityLevel ?? null,
  );
  // 이전 등급 상태(Ref)
  const prevLevelRef = useRef(userState?.activityLevel ?? null);
  // 등급 단계
  const LEVELS = ["NEWBIE", "REGULAR", "ACTIVE", "EXPERT"];
  // 등업 모달 상태
  const [levelUpOpen, setLevelUpOpen] = useLevelUpCheck({
    prevLevel: prevLevelRef.current,
    currentLevel,
    levels: LEVELS,
    reviewSubmitted,
  });

  /**
   * 리뷰 작성/수정 폼 제출 핸들러
   * - mode에 따라 리뷰 생성/수정 API 호출
   */
  const onSubmit = async (data: ReviewFormValues) => {
    if (!userState) return;
    const { reviewTitle, reviewContent, rating } = data;

    try {
      // 로그인 유저의 인증 토큰을 헤더에 포함
      const idToken = await getIdToken();
      const authHeaders: Record<string, string> = {
        Authorization: `Bearer ${idToken}`,
      };

      if (mode === "new") {
        const reviewApiData: ReviewApiData = {
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
        await postReview({
          reviewData: reviewApiData,
          authHeaders,
        });

        showSuccessHandler("알림", "리뷰가 성공적으로 생성되었습니다.", () => {
          hideSuccessHandler();
          router.push("/ticket-list");
        });
      } else if (mode === "edit" && reviewId) {
        await putReview({
          reviewId,
          reviewData: { reviewTitle, reviewContent, rating },
          authHeaders,
        });
        showSuccessHandler("알림", "리뷰가 성공적으로 수정되었습니다.", () => {
          hideSuccessHandler();
          router.push("/");
        });
      }

      // 리뷰 작성 성공 후 프로필 refetch 및 등급 변화 감지
      if (userState?.uid) {
        await dispatch(fetchUserProfile(userState.uid));
        setCurrentLevel(userState?.activityLevel ?? null);
        setReviewSubmitted(true);
        prevLevelRef.current = userState?.activityLevel ?? null;
      }
    } catch (error) {
      const { title, message } = firebaseErrorHandler(error);
      showErrorHandler(title, message);
      return;
    }
  };

  return {
    onSubmit,
    currentLevel,
    levelUpOpen,
    setLevelUpOpen,
  };
};
