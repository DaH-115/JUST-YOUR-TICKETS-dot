import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SerializableUser {
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SerializableUser>) {
      state.status = "succeeded";
      state.user = action.payload;
      state.error = null;
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
  setAuthError,
  clearUserState,
  onUpdateUserDisplayName,
  onUpdateUserEmail,
} = userSlice.actions;

export default userSlice;
