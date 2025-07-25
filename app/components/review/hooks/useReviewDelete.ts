"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";
import { useAlert } from "store/context/alertContext";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken/apiCallWithTokenRefresh";

// 리뷰 삭제 기능 훅
export function useReviewDelete(closeModalHandler: () => void) {
  const router = useRouter();
  const userState = useAppSelector(selectUser);
  const { showSuccessHandler, showErrorHandler } = useAlert();

  // 리뷰 삭제 핸들러
  const reviewDeleteHandler = useCallback(
    async (id: string) => {
      if (!userState?.uid) {
        showErrorHandler("오류", "로그인이 필요합니다.");
        return;
      }

      const confirmed = window.confirm("정말 삭제하시겠습니까?");
      if (!confirmed) {
        return;
      } else {
        closeModalHandler();
      }

      try {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(`/api/reviews/${id}`, {
            method: "DELETE",
            headers: {
              ...authHeaders,
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "삭제에 실패했습니다.");
          }

          return response.json();
        });

        showSuccessHandler("알림", "리뷰가 성공적으로 삭제되었습니다.", () => {
          router.refresh();
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("리뷰 티켓 삭제 중 오류 발생:", error.message);
          showErrorHandler("오류", error.message);
        }
      }
    },
    [
      closeModalHandler,
      showErrorHandler,
      showSuccessHandler,
      router,
      userState,
    ],
  );

  return { reviewDeleteHandler };
}
