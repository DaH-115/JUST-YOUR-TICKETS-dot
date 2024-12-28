import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Auth, onAuthStateChanged, User } from "firebase/auth";

interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type UserState = {
  user: SerializableUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

const serializeUser = (user: User): SerializableUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

// 인증 초기화 함수
export const initializeAuth = createAsyncThunk<() => void, Auth>(
  "user/initializeAuth",
  async (auth, { dispatch }) => {
    console.log("1. initializeAuth 시작");
    dispatch(setAuthStatus("loading"));

    return onAuthStateChanged(auth, (user) => {
      console.log("2. onAuthStateChanged 실행됨", user);

      if (user) {
        console.log("3. 인증된 사용자 발견:", {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        dispatch(setUser(serializeUser(user)));
        console.log("4. Redux 상태 업데이트 완료");
      } else {
        console.log("3. 인증된 사용자 없음");
        dispatch(clearUserState());
      }
    });
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SerializableUser>) {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
    },
    setAuthStatus(state, action: PayloadAction<UserState["status"]>) {
      state.status = action.payload;
    },
    setAuthError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    clearUserState(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    onUpdateUserDisplayName(
      state,
      action: PayloadAction<{ displayName: string }>,
    ) {
      if (state.user) {
        state.user = {
          ...state.user,
          displayName: action.payload.displayName,
        };
      }
    },
    onUpdateUserEmail(state, action: PayloadAction<{ email: string }>) {
      if (state.user) {
        state.user = {
          ...state.user,
          email: action.payload.email,
        };
      }
    },
  },
});

export const {
  setUser,
  setAuthStatus,
  setAuthError,
  clearUserState,
  onUpdateUserDisplayName,
  onUpdateUserEmail,
} = userSlice.actions;

export default userSlice;
