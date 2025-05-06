import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db, isAuth } from "firebase-config";
import { updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { RootState } from "..";

export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface UserMetaData {
  provider: string | null;
  biography: string | null;
  createdAt: number;
  updatedAt: number;
}

type UserState = {
  auth: SerializableUser | null;
  metaData: UserMetaData | null;
  authStatus: "idle" | "loading" | "succeeded" | "failed";
  metaDataStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: UserState = {
  auth: null,
  metaData: null,
  authStatus: "idle",
  metaDataStatus: "idle",
  error: null,
};

// Firestore에서 사용자 프로필 가져오기
export const fetchUserMetaData = createAsyncThunk<
  UserMetaData,
  string,
  { rejectValue: string }
>("user/fetchUserMetaData", async (uid, { rejectWithValue }) => {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) throw new Error("사용자 정보가 없습니다.");
    const data = snap.data();

    return {
      provider: data.provider,
      biography: data.biography,
      createdAt: data.createdAt?.toMillis() ?? Date.now(),
      updatedAt: data.updatedAt?.toMillis() ?? Date.now(),
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface UpdateUserMetaDataPayload {
  biography: string;
  updatedAt: number;
}

// Firestore에서 사용자 프로필 업데이트하기 (biography 수정)
export const updateUserMetaData = createAsyncThunk<
  UpdateUserMetaDataPayload,
  { uid: string; data: { biography: string } },
  { rejectValue: string }
>("user/updateUserMetaData", async ({ uid, data }, { rejectWithValue }) => {
  try {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, {
      biography: data.biography,
      updatedAt: serverTimestamp(),
    });

    return {
      biography: data.biography,
      updatedAt: Date.now(),
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Firebase User displayName 수정
export const updateUserDisplayName = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  "user/updateUserDisplayName",
  async (newDisplayName, { rejectWithValue, getState }) => {
    const auth = getState().userData.auth;
    if (!auth) return rejectWithValue("사용자 정보가 없습니다.");
    const firebaseUser = isAuth.currentUser;
    if (!firebaseUser) return rejectWithValue("Firebase Auth 정보가 없습니다.");

    try {
      await updateProfile(firebaseUser, { displayName: newDisplayName });

      await runTransaction(db, async (transaction) => {
        const oldDisplayName = auth.displayName;
        const newDisplayNameRef = doc(db, "usernames", newDisplayName);
        const newDisplayNameSnapshot = await transaction.get(newDisplayNameRef);
        if (newDisplayNameSnapshot.exists()) {
          throw new Error("이미 사용 중인 닉네임입니다.");
        }

        if (oldDisplayName) {
          const oldDisplayNameRef = doc(db, "usernames", oldDisplayName);
          const oldDisplayNameSnapshot =
            await transaction.get(oldDisplayNameRef);
          if (oldDisplayNameSnapshot.exists()) {
            transaction.delete(oldDisplayNameRef);
          }
        }

        transaction.set(newDisplayNameRef, {
          uid: auth.uid,
          createdAt: serverTimestamp(),
        });

        const userRef = doc(db, "users", auth.uid);
        transaction.update(userRef, {
          updatedAt: serverTimestamp(),
        });
      });

      return newDisplayName;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<SerializableUser>) {
      state.auth = action.payload;
      state.authStatus = "succeeded";
    },
    clearUser(state) {
      state.auth = null;
      state.metaData = null;
      state.authStatus = "idle";
      state.metaDataStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserMetaData
      .addCase(fetchUserMetaData.pending, (state) => {
        state.metaDataStatus = "loading";
      })
      .addCase(fetchUserMetaData.fulfilled, (state, action) => {
        state.metaDataStatus = "succeeded";
        state.metaData = action.payload;
      })
      .addCase(fetchUserMetaData.rejected, (state, action) => {
        state.metaDataStatus = "failed";
        state.error =
          action.payload || "사용자 정보를 가져오는 중 오류가 발생했습니다.";
      })
      // updateUserMetaData
      .addCase(updateUserMetaData.pending, (state) => {
        state.metaDataStatus = "loading";
      })
      .addCase(updateUserMetaData.fulfilled, (state, { payload }) => {
        state.metaDataStatus = "succeeded";
        if (state.metaData) {
          state.metaData = {
            ...state.metaData,
            biography: payload.biography,
            updatedAt: payload.updatedAt,
          };
        }
      })
      .addCase(updateUserMetaData.rejected, (state, action) => {
        state.metaDataStatus = "failed";
        state.error =
          action.payload ||
          "사용자 정보를 업데이트하는 중 오류가 발생했습니다.";
      })
      // updateAuthDisplayName
      .addCase(updateUserDisplayName.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(updateUserDisplayName.fulfilled, (state, action) => {
        if (state.auth) state.auth.displayName = action.payload;
        state.authStatus = "succeeded";
      })
      .addCase(updateUserDisplayName.rejected, (state, action) => {
        state.authStatus = "failed";
        state.error =
          action.payload ||
          "사용자 정보를 업데이트하는 중 오류가 발생했습니다.";
      });
  },
});

export const { setAuthUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
