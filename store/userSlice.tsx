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

const serializeUser = (user: User) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
});

export const fetchUser = createAsyncThunk<SerializableUser | null, Auth>(
  "user/fetchUser",
  async (auth, { rejectWithValue }) => {
    try {
      const user = await new Promise<User | null>((resolve) => {
        onAuthStateChanged(auth, (user) => {
          resolve(user);
        });
      });

      if (!user) {
        return rejectWithValue("No user found");
      }

      return serializeUser(user);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    onUpdateUserProfile(state, action: PayloadAction<{ displayName: string }>) {
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<SerializableUser | null>) => {
          state.status = "succeeded";
          state.user = action.payload;
        },
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export default userSlice;
export const { clearUserState, onUpdateUserProfile, onUpdateUserEmail } =
  userSlice.actions;
