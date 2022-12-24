import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import { isAuth } from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

interface authState {
  userId: string;
  isSigned: boolean;
}

const defaultState: authState = {
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

  const authCtx: authState = {
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
