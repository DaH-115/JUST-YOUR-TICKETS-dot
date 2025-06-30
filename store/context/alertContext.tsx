"use client";

import { createContext, useCallback, useContext, useState } from "react";
import UserAlert from "app/ui/UserAlert";

interface AlertContextType {
  showErrorHandler: (title: string, message: string) => void;
  showSuccessHandler: (
    title: string,
    message: string,
    onConfirm?: () => void,
  ) => void;
  hideErrorHanlder: () => void;
  hideSuccessHandler: () => void;
}

interface ErrorType {
  title: string;
  message: string;
}

interface SuccessType {
  title: string;
  message: string;
  onConfirm: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [errorState, setErrorState] = useState<ErrorType | null>(null);
  const [successState, setSuccessState] = useState<SuccessType | null>(null);

  const hideErrorHanlder = useCallback(() => {
    setErrorState(null);
  }, []);

  const hideSuccessHandler = useCallback(() => {
    setSuccessState(null);
  }, []);

  const showErrorHandler = useCallback((title: string, message: string) => {
    setErrorState({ title, message });
    setSuccessState(null); // 에러 상태일 때는 성공 메시지를 숨깁니다
  }, []);

  const showSuccessHandler = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      const handleConfirm = () => {
        if (onConfirm) {
          onConfirm();
        }
        hideSuccessHandler();
      };

      setSuccessState({
        title,
        message,
        onConfirm: handleConfirm,
      });
      setErrorState(null); // 성공 상태일 때는 에러 메시지를 숨깁니다
    },
    [hideSuccessHandler],
  );

  return (
    <AlertContext.Provider
      value={{
        showErrorHandler,
        hideErrorHanlder,
        showSuccessHandler,
        hideSuccessHandler,
      }}
    >
      {children}
      {/* Error Alert */}
      {errorState && (
        <UserAlert
          title={errorState.title}
          description={errorState.message}
          onConfirm={hideErrorHanlder}
        />
      )}
      {/* Success Alert */}
      {successState && (
        <UserAlert
          title={successState.title}
          description={successState.message}
          onConfirm={successState.onConfirm}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within a AlertProvider");
  }
  return context;
}
