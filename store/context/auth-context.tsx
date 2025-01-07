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
import { isAuth } from "firebase-config";
import { useAppDispatch } from "store/redux-toolkit/hooks";
import { getCookie, removeCookie, setCookie } from "app/utils/cookie-utils";
import { onAuthStateChanged } from "firebase/auth";
import serializeUser from "app/utils/firebase-utils";
import { clearUserState, setUser } from "store/redux-toolkit/slice/userSlice";

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
    const unsubscribe = onAuthStateChanged(isAuth, async (user) => {
      try {
        if (user) {
          // a. 사용자가 인증된 경우
          const savedToken = getCookie();
          const isRemembered = localStorage.getItem("rememberMe") === "true";

          // 토큰이 없다면 새로 발급
          if (!savedToken) {
            const token = await user.getIdToken();
            setCookie(token, isRemembered);
          }

          // Redux에 사용자 정보 저장
          dispatch(setUser(serializeUser(user)));

          setAuthState({ isAuthenticated: true, isLoading: false });
        } else {
          // b. 사용자가 인증 되지 않은 경우

          // 쿠키와 로컬 스토리지 정리
          removeCookie();
          localStorage.removeItem("rememberMe");

          // Redux 사용자 정보 초기화
          dispatch(clearUserState());

          setAuthState({ isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        // 에러가 발생한 경우 안전하게 처리합니다
        console.error("인증 상태 확인 중 오류:", error);

        // 모든 인증 관련 데이터를 정리합니다
        removeCookie();
        localStorage.removeItem("rememberMe");
        dispatch(clearUserState());

        // 에러 상태를 설정합니다
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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
