import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Auth, onAuthStateChanged, User } from "firebase/auth";

interface UserState {
  user: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

export const fetchUser = createAsyncThunk<User | null, Auth>(
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

      return user;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch user";
      });
  },
});

export default userSlice;
export const { clearUserState } = userSlice.actions;
