"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Modal from "app/ui/Modal";
import SuccessAlert from "app/ui/SuccessAlert";

interface AlertContextType {
  showErrorHanlder: (title: string, message: string, status?: number) => void;
  showSuccessHanlder: (
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
  status?: number;
}

interface SuccessType {
  title: string;
  message: string;
  onConfirm?: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [errorState, setErrorState] = useState<ErrorType | null>(null);
  const [successState, setSuccessState] = useState<SuccessType | null>(null);

  const showErrorHanlder = useCallback(
    (title: string, message: string, status?: number) => {
      setErrorState({ title, message, status });
      setSuccessState(null); // 에러 상태일 때는 성공 메시지를 숨깁니다
    },
    [],
  );

  const showSuccessHanlder = useCallback(
    (title: string, message: string, onConfirm?: () => void) => {
      setSuccessState({ title, message, onConfirm });
      setErrorState(null); // 성공 상태일 때는 에러 메시지를 숨깁니다
    },
    [],
  );

  const hideErrorHanlder = useCallback(() => {
    setErrorState(null);
  }, []);

  const hideSuccessHandler = useCallback(() => {
    setSuccessState(null);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        showErrorHanlder,
        hideErrorHanlder,
        showSuccessHanlder,
        hideSuccessHandler,
      }}
    >
      {children}
      {errorState && (
        <Modal
          title={errorState.title}
          description={errorState.message}
          status={errorState.status}
          onConfirm={hideErrorHanlder}
        />
      )}
      {successState && (
        <SuccessAlert
          title={successState.title}
          description={successState.message}
          onConfirm={() => {
            successState.onConfirm?.();
            hideSuccessHandler();
          }}
        />
      )}
    </AlertContext.Provider>
  );
}

export function useAlert(): AlertContextType {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useError must be used within a ErrorProvider");
  }
  return context;
}
