"use client";

import ModalAlert from "app/ui/alert/modal-alert";
import { createContext, useCallback, useContext, useState } from "react";

interface ErrorContextType {
  isShowError: (title: string, message: string, status?: number) => void;
  isHideError: () => void;
}

interface ErrorType {
  title: string;
  message: string;
  status?: number;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorType | null>(null);

  const isShowError = useCallback(
    (title: string, message: string, status?: number) => {
      setError({ title, message, status });
    },
    [],
  );

  const isHideError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ErrorContext.Provider value={{ isShowError, isHideError }}>
      {children}
      {error && (
        <ModalAlert
          title={error.title}
          description={error.message}
          status={error.status}
          onClose={isHideError}
          variant="destructive"
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
