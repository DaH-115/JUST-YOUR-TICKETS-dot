"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { isAuth, db } from "firebase-config";
import { useAppDispatch } from "store/redux-toolkit/hooks";
import {
  clearUser,
  fetchUserMetaData,
  SerializableUser,
  setAuthUser,
} from "store/redux-toolkit/slice/userSlice";
import { useRouter } from "next/navigation";
import { useAlert } from "store/context/alertContext";
import {
  getCurrentPersistence,
  clearAuthPersistence,
} from "app/utils/authPersistence";
import Loading from "app/loading";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

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
    // 페이지 로드 시 persistence 설정 확인
    const checkPersistence = () => {
      const persistence = getCurrentPersistence();

      // 세션 기반 로그인이었는데 브라우저가 재시작된 경우
      if (
        persistence === "session" &&
        !sessionStorage.getItem("authPersistence")
      ) {
        // 세션 스토리지가 비어있다면 브라우저가 재시작된 것으로 간주
        signOut(isAuth);
        clearAuthPersistence();
        return;
      }
    };

    checkPersistence();

    const unsubscribe = onAuthStateChanged(isAuth, (user) => {
      if (user) {
        // 사용자가 로그인했을 때 Firestore 구독 시작
        const userDocRef = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(userDocRef, (snapshot) => {
          const dbUser = snapshot.data();

          // Auth 정보와 Firestore 정보를 합쳐서 Redux 스토어 업데이트
          const combinedUserData: SerializableUser = {
            uid: user.uid,
            email: user.email,
            displayName: dbUser?.displayName || user.displayName,
            photoURL: dbUser?.photoKey || user.photoURL,
          };

          dispatch(setAuthUser(combinedUserData));

          // 추가 메타데이터(등급 등) 가져오기
          if (combinedUserData.uid) {
            dispatch(fetchUserMetaData(combinedUserData.uid));
          }
        });

        setAuthState({ isAuthenticated: true, isLoading: false });

        // Clean-up 함수에서 Firestore 구독 해제
        return () => {
          unsubscribeSnapshot();
        };
      } else {
        dispatch(clearUser());
        setAuthState({ isAuthenticated: false, isLoading: false });
      }
    });

    return unsubscribe;
  }, [dispatch]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// 인증이 필요한 페이지용 컴포넌트
export function PrivateRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { showSuccessHandler } = useAlert();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showSuccessHandler("로그인 필요", "로그인이 필요합니다.", () => {
        router.replace("/login");
      });
    }
  }, [isLoading, isAuthenticated, router, showSuccessHandler]);

  if (isLoading || !isAuthenticated) {
    return <Loading />;
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

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  if (isLoading || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
