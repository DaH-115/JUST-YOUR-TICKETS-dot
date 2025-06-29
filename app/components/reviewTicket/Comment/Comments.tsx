import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import formatDate from "app/utils/formatDate";
import ActivityBadge from "app/components/ActivityBadge";
import ProfileImage from "app/components/reviewTicket/ProfileImage";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";

const commentSchema = z.object({
  comment: z
    .string()
    .min(1, { message: "댓글을 입력해주세요." })
    .max(500, { message: "댓글은 500자 이하로 작성해주세요." }),
});
type CommentForm = z.infer<typeof commentSchema>;

interface Comment {
  id: string;
  authorId: string;
  displayName: string;
  photoURL?: string;
  content: string;
  createdAt: string;
}

export default function Comments({
  id: reviewId,
  reviewAuthorId,
}: Pick<ReviewDoc, "id"> & { reviewAuthorId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null 이면 새 댓글, 댓글ID면 수정 모드

  const userState = useAppSelector((state) => state.userData.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment: "" },
  });

  // 댓글 목록 가져오기
  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments/${reviewId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  }, [reviewId]);

  useEffect(() => {
    // reviewId가 변경될 때 상태 초기화
    setComments([]);
    setEditingId(null);
    reset();

    // 댓글 목록 가져오기
    fetchComments();

    return () => {
      // 컴포넌트 언마운트 시 상태 초기화
      setComments([]);
      setEditingId(null);
      reset();
    };
  }, [reviewId, reset, fetchComments]);

  // 댓글 등록/수정 핸들러
  const onSubmit = useCallback(
    async (data: CommentForm) => {
      if (!data.comment.trim() || isPosting || !userState) {
        return;
      }
      setIsPosting(true);
      const content = data.comment.trim();

      try {
        if (editingId) {
          // 댓글 수정
          await apiCallWithTokenRefresh(async (authHeaders) => {
            const response = await fetch(
              `/api/comments/${reviewId}/${editingId}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeaders,
                },
                body: JSON.stringify({ content }),
              },
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "댓글 수정에 실패했습니다.");
            }

            return response.json();
          });

          // 수정 모드 해제 및 폼 리셋
          setEditingId(null);
          reset({ comment: "" }); // 명시적으로 빈 문자열로 리셋
        } else {
          // 댓글 생성
          await apiCallWithTokenRefresh(async (authHeaders) => {
            const response = await fetch(`/api/comments/${reviewId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({
                authorId: userState.uid,
                displayName: userState.displayName || "익명",
                photoURL: userState.photoURL,
                content,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "댓글 등록에 실패했습니다.");
            }

            return response.json();
          });
        }

        // 폼 완전히 리셋 (수정 모드가 아닌 경우에만 추가로 리셋)
        if (!editingId) {
          reset({ comment: "" });
        }
        await fetchComments(); // 댓글 목록 새로고침
      } catch (error) {
        console.error("댓글 처리 실패:", error);
        alert(
          error instanceof Error ? error.message : "댓글 처리에 실패했습니다.",
        );
      } finally {
        setIsPosting(false);
      }
    },
    [isPosting, editingId, reviewId, reset, userState, fetchComments],
  );

  // 댓글 수정 핸들러
  const editHandler = useCallback(
    (id: string, comment: string) => {
      setEditingId(id);
      reset({ comment }); // 폼에 기존 댓글 내용 설정
    },
    [reset],
  );

  // 댓글 삭제 핸들러
  const deleteComment = useCallback(
    async (commentId: string) => {
      if (!userState?.uid || isPosting) {
        return;
      }

      if (!confirm("정말로 댓글을 삭제하시겠습니까?")) {
        return;
      }

      setIsPosting(true);

      try {
        await apiCallWithTokenRefresh(async (authHeaders) => {
          const response = await fetch(
            `/api/comments/${reviewId}/${commentId}`,
            {
              method: "DELETE",
              headers: {
                ...authHeaders,
              },
            },
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "댓글 삭제에 실패했습니다.");
          }

          return response.json();
        });

        await fetchComments(); // 댓글 목록 새로고침
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert(
          error instanceof Error ? error.message : "댓글 삭제에 실패했습니다.",
        );
      } finally {
        setIsPosting(false);
      }
    },
    [userState?.uid, isPosting, reviewId, fetchComments],
  );

  // 취소 버튼 핸들러
  const cancelEditHandler = useCallback(() => {
    reset();
    setEditingId(null);
  }, [reset]);

  return (
    <>
      {comments.length > 0 && (
        <div className="mb-2 flex items-center justify-between border-t-4 border-dotted pt-2">
          <p className="text-sm font-medium text-gray-700">
            댓글 {comments.length}개
          </p>
        </div>
      )}
      <div
        className={`${comments.length > 0 ? "max-h-80 overflow-y-auto scrollbar-hide" : "hidden"}`}
      >
        <ul className="space-y-2">
          {comments.map((c, idx) => (
            <li
              key={c.id}
              className={`py-2 ${idx < comments.length - 1 ? "border-b" : ""}`}
            >
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-normal text-gray-800">
                      {idx + 1}.
                    </span>
                    <ProfileImage
                      photoURL={c.photoURL}
                      userDisplayName={c.displayName || "익명"}
                    />
                    <p className="text-xs font-bold text-gray-800">
                      {c.displayName || "익명"}
                    </p>
                    <ActivityBadge
                      activityLevel={(c as any).activityLevel}
                      size="tiny"
                    />
                  </div>
                  {c.authorId === reviewAuthorId && (
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      작성자
                    </span>
                  )}
                </div>
                {/* 댓글 작성자와 로그인한 유저가 같을 때만 수정/삭제 버튼 노출 */}
                {userState?.uid === c.authorId && (
                  <div className="flex items-center space-x-2">
                    {/* 댓글 수정 버튼 */}
                    <button
                      onClick={() => editHandler(c.id, c.content)}
                      className="text-xs text-black hover:underline"
                    >
                      수정
                    </button>
                    {/* 댓글 삭제 버튼 */}
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className="py-2 text-sm">{c.content}</p>
              <span className="mt-2 block text-xs text-gray-600">
                {formatDate(c.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {userState?.uid && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-t-4 border-dotted pt-4"
        >
          <textarea
            {...register("comment")}
            className={`w-full rounded-md border p-2 ${errors.comment ? "border-red-500" : ""}`}
            rows={2}
            placeholder="댓글을 입력하세요"
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-500">
              {errors.comment.message}
            </p>
          )}
          <div className="mt-2 flex items-center justify-end text-sm">
            {editingId && (
              <button
                type="button"
                className="mr-4 text-gray-700 hover:underline"
                onClick={cancelEditHandler}
                aria-label="댓글 수정 취소"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 active:bg-primary-700 disabled:opacity-50"
              aria-label={editingId ? "댓글 수정 완료" : "댓글 등록"}
            >
              {editingId ? "수정 완료" : "등록"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
