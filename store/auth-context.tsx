"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { initializeAuth } from "store/userSlice";
import { isAuth } from "firebase-config";
import { useAppDispatch } from "store/hooks";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // 1. 쿠키 확인
    const getCookie = (name: string) => {
      const value = `${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
      }
      return null;
    };
    const session = getCookie("firebase-session-token");
    console.log("현재 세션:", session);

    // 2. Firebase 인증 설정
    let unsubscribe: () => void;

    console.log("세션 존재 무시, initializeAuth 호출 시도");
    const setupAuth = async () => {
      const result = await dispatch(initializeAuth(isAuth));
      if (initializeAuth.fulfilled.match(result)) {
        unsubscribe = result.payload;
        console.log("initializeAuth 성공, 리스너 설정됨");
      }
    };
    setupAuth();

    setAuthState({
      isAuthenticated: !!session,
      isLoading: false,
    });

    return () => {
      if (unsubscribe) {
        console.log("리스너 정리됨");
        unsubscribe();
      }
    };
  }, [dispatch, document.cookie]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 인증이 필요한 페이지용 컴포넌트
export function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasAlerted.current) {
      hasAlerted.current = true;
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// 비로그인 상태에서만 접근 가능한 페이지용 컴포넌트
export function PublicRoute({
  children,
  redirectTo = "/",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
