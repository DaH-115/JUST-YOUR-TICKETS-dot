import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import formatDate from "app/utils/formatDate";
import { db } from "firebase-config";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ReviewDoc } from "lib/reviews/fetchReviewsPaginated";

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
  content: string;
  createdAt: string;
}

export default function Comments({ id: reviewId }: Pick<ReviewDoc, "id">) {
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

  useEffect(() => {
    // reviewId가 변경될 때 상태 초기화
    setComments([]);
    setEditingId(null);
    reset();

    const commentsCol = collection(db, "movie-reviews", reviewId, "comments");
    const querys = query(commentsCol, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(querys, (snap) => {
      const commentList = snap.docs.map((doc) => {
        const data = doc.data() as {
          authorId: string;
          displayName: string;
          content: string;
          createdAt: Timestamp;
        };

        return {
          id: doc.id,
          authorId: data.authorId,
          displayName: data.displayName,
          content: data.content,
          createdAt: data.createdAt.toDate().toISOString(),
        };
      });

      setComments(commentList);
    });

    return () => {
      unsubscribe();
      // 컴포넌트 언마운트 시 상태 초기화
      setComments([]);
      setEditingId(null);
      reset();
    };
  }, [reviewId, reset]);

  // 댓글 등록 핸들러
  const onSubmit = useCallback(
    async (data: CommentForm) => {
      if (!data.comment.trim() || isPosting) {
        return;
      }
      setIsPosting(true);
      const content = data.comment.trim();

      if (editingId) {
        try {
          const ref = doc(db, "movie-reviews", reviewId, "comments", editingId);
          await updateDoc(ref, {
            content,
            updatedAt: serverTimestamp(),
          });
          reset(); // 폼 비우기
        } catch (error) {
          console.error("댓글 수정 실패", error);
        } finally {
          setEditingId(null);
          setIsPosting(false);
        }
      } else {
        try {
          await addDoc(collection(db, "movie-reviews", reviewId, "comments"), {
            authorId: userState?.uid,
            content,
            createdAt: serverTimestamp(),
          });
          reset(); // 폼 비우기
        } catch (error) {
          console.error("댓글 등록 실패", error);
        } finally {
          setIsPosting(false);
        }
      }
    },
    [isPosting, editingId, reviewId, reset, userState],
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
      setIsPosting(true);

      try {
        if (!confirm("정말로 댓글을 삭제하시겠습니까?")) {
          setIsPosting(false);
          return;
        }

        const commentRef = doc(
          db,
          "movie-reviews",
          reviewId,
          "comments",
          commentId,
        );
        await deleteDoc(commentRef);
      } catch (error) {
        console.error("댓글 삭제 실패", error);
      } finally {
        setIsPosting(false);
      }
    },
    [userState?.uid, isPosting, reviewId],
  );

  // 취소 버튼 핸들러
  const cancelEditHandler = useCallback(() => {
    reset();
    setEditingId(null);
  }, [reset]);

  return (
    <>
      <div
        className={`${comments.length > 0 ? "h-40 flex-1 overflow-y-scroll border-t-4 border-dotted" : "hidden"}`}
      >
        <ul className="space-y-2">
          {comments.map((c, idx) => (
            <li key={c.id} className="border-b py-2">
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs font-bold text-gray-800">
                  <span className="mr-1 font-normal">{idx + 1}.</span>
                  {c.displayName}
                </p>
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
              <span className="text-xs text-gray-500">
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
          <div className="mt-2 flex items-center justify-end">
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
              className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 active:bg-primary-700 disabled:opacity-50"
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
