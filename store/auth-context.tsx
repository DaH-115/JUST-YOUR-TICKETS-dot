import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import { isAuth } from 'firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthStateTypes {
  userId: string;
  isSigned: boolean;
}

const defaultState: AuthStateTypes = {
  userId: '',
  isSigned: false,
};

const StateContext = createContext(defaultState);

const AuthStateProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState(defaultState);

  useEffect(() => {
    onAuthStateChanged(isAuth, (user) => {
      if (user) {
        setAuthState((prev) => ({
          ...prev,
          userId: user.uid,
          isSigned: true,
        }));
      }
    });
  }, []);

  const authCtx: AuthStateTypes = {
    userId: authState.userId,
    isSigned: authState.isSigned,
  };

  return (
    <StateContext.Provider value={authCtx}>{children}</StateContext.Provider>
  );
};

export const useAuthState = () => {
  return useContext(StateContext);
};

export default AuthStateProvider;
