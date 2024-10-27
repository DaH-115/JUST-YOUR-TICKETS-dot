import { db, isAuth } from "firebase-config";
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { firebaseErrorHandler } from "./utils/firebase-error";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useError } from "store/error-context";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { onUpdateUserEmail } from "store/userSlice";
import { updateEmail } from "firebase/auth";

const emailSchema = z.object({
  email: z
    .string()
    .email("올바른 이메일 형식이 아닙니다")
    .min(1, "이메일을 입력해주세요"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function ChangeEmail() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const serializedUser = useAppSelector((state) => state.user.user);
  const { isShowError, isShowSuccess } = useError();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const editingToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      reset();
    }
  }, [isEditing, reset]);

  const onSubmitHandler = async (data: EmailFormData) => {
    if (!serializedUser) {
      isShowError("오류", "로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 이메일 중복 체크
      const emailQuery = query(
        collection(db, "users"),
        where("email", "==", data.email),
        limit(1),
      );
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        isShowError("알림", "이미 사용 중인 이메일입니다.");
        return;
      }

      const currentUser = isAuth.currentUser;
      if (!currentUser) {
        isShowError("오류", "로그인이 필요합니다.");
        return;
      }

      // 2. Auth 이메일 업데이트
      await updateEmail(currentUser, data.email);

      // 3. Firestore 사용자 이메일 수정
      const userDocRef = doc(db, "users", serializedUser.uid);
      await updateDoc(userDocRef, {
        email: data.email,
        updatedAt: new Date().toISOString(),
      });

      dispatch(onUpdateUserEmail({ email: data.email }));
      isShowSuccess("알림", "이메일이 수정되었습니다.");
      editingToggle();
    } catch (err) {
      const { title, message } = firebaseErrorHandler(err);
      isShowError(title, message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex w-full items-center justify-between gap-4"
    >
      <div className="flex-1">
        {!isEditing ? (
          <div className="text-gray-600">이메일을 입력해 주세요.</div>
        ) : (
          <>
            <input
              {...register("email")}
              type="email"
              placeholder="이메일을 입력하세요"
              className={`w-full bg-transparent ${
                isLoading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </>
        )}
      </div>
      {!isEditing ? (
        <div
          onClick={editingToggle}
          className="cursor-pointer whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-black hover:text-white"
        >
          수정
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={editingToggle}
            className="whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-gray-100"
            disabled={isLoading}
          >
            취소
          </button>
          <button
            type="submit"
            className="whitespace-nowrap rounded-xl px-2 py-1 text-xs transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "저장"}
          </button>
        </div>
      )}
    </form>
  );
}
