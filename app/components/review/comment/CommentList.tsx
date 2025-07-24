import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import ActivityBadge from "app/components/ui/feedback/ActivityBadge";
import ProfileAvatar from "app/components/user/ProfileAvatar";
import formatDate from "app/utils/formatDate";
import { apiCallWithTokenRefresh } from "app/utils/getIdToken";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { selectUser } from "store/redux-toolkit/slice/userSlice";

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
  photoKey: string | null;
  content: string;
  activityLevel: string;
  createdAt: string | null;
  updatedAt?: string | null;
}

export default function CommentList({
  id: reviewId,
  reviewAuthorId,
}: Pick<ReviewDoc, "id"> & { reviewAuthorId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null); // null 이면 새 댓글, 댓글ID면 수정 모드
  const userState = useAppSelector(selectUser); // 댓글 작성자 정보
  // 댓글 작성 폼 상태 관리
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment: "" },
  });

  // 댓글 목록 가져오는 함수 정의
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/comments/${reviewId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    // reviewId가 변경될 때 상태 초기화
    setComments([]);
    setEditingId(null);
    setIsLoading(true);
    reset();
    fetchComments(); // 댓글 목록 가져오기
  }, [reviewId, reset, fetchComments]);

  // 댓글 등록/수정 핸들러
  const onSubmit = useCallback(
    async (data: CommentForm) => {
      // 댓글 내용이 비어있거나, 이미 댓글 등록 중이거나, 로그인 상태가 아니면 종료
      if (!data.comment.trim() || isPosting || !userState) {
        return;
      }

      setIsPosting(true); // 댓글 등록/수정 중임을 표시
      const content = data.comment.trim(); // 댓글 내용 정리

      try {
        // 댓글 수정 모드인 경우
        if (editingId) {
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
          // 댓글 생성 모드인 경우
          await apiCallWithTokenRefresh(async (authHeaders) => {
            const response = await fetch(`/api/comments/${reviewId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...authHeaders,
              },
              body: JSON.stringify({
                authorId: userState.uid,
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

      if (!confirm("정말 댓글을 삭제하시겠습니까?")) {
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
      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="flex items-center justify-center border-t-4 border-dotted py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            댓글을 불러오는 중...
          </span>
        </div>
      )}

      {/* 댓글 목록 */}
      {!isLoading && comments.length > 0 && (
        <div className="mb-2 flex items-center justify-between border-t-4 border-dotted pt-2">
          <p className="text-sm font-medium text-gray-700">
            댓글 {comments.length}개
          </p>
        </div>
      )}
      <div
        className={`${!isLoading && comments.length > 0 ? "overflow-y-auto scrollbar-hide" : "hidden"}`}
      >
        <ul className="space-y-2">
          {comments.map((comment, idx) => (
            <li
              key={comment.id}
              className={`py-2 ${idx < comments.length - 1 ? "border-b" : ""}`}
            >
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-normal text-gray-800">
                      {`${idx + 1}.`}
                    </span>
                    <ProfileAvatar
                      s3photoKey={comment.photoKey || undefined}
                      userDisplayName={comment.displayName || "익명"}
                      size={24}
                    />
                    <p className="text-xs font-bold text-gray-800">
                      {comment.displayName || "익명"}
                    </p>
                    <ActivityBadge
                      activityLevel={comment.activityLevel}
                      size="tiny"
                    />
                  </div>
                  {comment.authorId === reviewAuthorId && (
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      작성자
                    </span>
                  )}
                </div>
                {/* 댓글 작성자와 로그인한 유저가 같을 때만 수정/삭제 버튼 노출 */}
                {userState?.uid === comment.authorId && (
                  <div className="flex items-center space-x-2">
                    {/* 댓글 수정 버튼 */}
                    <button
                      onClick={() => editHandler(comment.id, comment.content)}
                      className="text-xs text-black hover:underline"
                    >
                      수정
                    </button>
                    {/* 댓글 삭제 버튼 */}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
              <p className="py-2 text-sm">{comment.content}</p>
              <span className="mt-2 block text-xs text-gray-600">
                {formatDate(comment.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 댓글 작성 폼 */}
      {!isLoading && userState?.uid && (
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
              className="rounded-full bg-primary-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-primary-400 disabled:bg-gray-400"
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
