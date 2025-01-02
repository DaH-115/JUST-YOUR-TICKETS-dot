"use client";

import { createContext, useCallback, useContext, useState } from "react";
import ModalAlert from "app/ui/alert/modal-alert";
import ModalSuccessAlert from "app/ui/alert/modal-success-alert";

interface ErrorContextType {
  isShowError: (title: string, message: string, status?: number) => void;
  isShowSuccess: (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => void;
  isHideError: () => void;
  isHideSuccess: () => void;
}

interface ErrorType {
  title: string;
  message: string;
  status?: number;
}

interface SuccessType {
  title: string;
  message: string;
  onConfirm?: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [isError, setIsError] = useState<ErrorType | null>(null);
  const [isSuccess, setIsSuccess] = useState<SuccessType | null>(null);

  const isShowError = useCallback(
    (title: string, message: string, status?: number) => {
      setIsError({ title, message, status });
      setIsSuccess(null); // 에러 상태일 때는 성공 메시지를 숨깁니다
    },
    [],
  );

  const isShowSuccess = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      setIsSuccess({ title, message, onConfirm });
      setIsError(null); // 성공 상태일 때는 에러 메시지를 숨깁니다
    },
    [],
  );

  const isHideError = useCallback(() => {
    setIsError(null);
  }, []);

  const isHideSuccess = useCallback(() => {
    setIsSuccess(null);
  }, []);

  return (
    <ErrorContext.Provider
      value={{ isShowError, isHideError, isShowSuccess, isHideSuccess }}
    >
      {children}
      {isError && (
        <ModalAlert
          title={isError.title}
          description={isError.message}
          status={isError.status}
          onConfirm={isHideError}
          variant="destructive"
        />
      )}
      {isSuccess && (
        <ModalSuccessAlert
          title={isSuccess.title}
          description={isSuccess.message}
          onConfirm={() => {
            isSuccess.onConfirm?.();
            isHideSuccess();
          }}
        />
      )}
    </ErrorContext.Provider>
  );
}

export function useError(): ErrorContextType {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within a ErrorProvider");
  }
  return context;
}
