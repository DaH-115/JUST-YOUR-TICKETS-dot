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
  createdAt: string;
  updatedAt: string;
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
      createdAt: data.createdAt
        ? new Date(data.createdAt.toMillis()).toISOString()
        : new Date().toISOString(),
      updatedAt: data.updatedAt
        ? new Date(data.updatedAt.toMillis()).toISOString()
        : new Date().toISOString(),
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface UpdateUserMetaDataPayload {
  biography: string;
  updatedAt: string; // number → string
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
      updatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

/**
 * Firebase User displayName 수정
 * 1. Firebase Auth의 displayName 업데이트
 * 2. Firestore usernames 컬렉션에서 닉네임 중복 검사 및 관리
 * 3. 기존 닉네임 삭제 후 새 닉네임 등록
 *
 * @param newDisplayName - 새로 설정할 닉네임
 * @returns 성공 시 새 닉네임, 실패 시 에러 메시지
 */
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
    // 1. Redux 스토어에서 현재 사용자 정보 가져오기
    const auth = getState().userData.auth;
    if (!auth) return rejectWithValue("사용자 정보가 없습니다.");

    // 2. Firebase Auth에서 현재 로그인된 사용자 확인
    const firebaseUser = isAuth.currentUser;
    if (!firebaseUser) return rejectWithValue("Firebase Auth 정보가 없습니다.");

    try {
      // 3. Firebase Auth의 displayName 업데이트
      await updateProfile(firebaseUser, { displayName: newDisplayName });

      // 4. Firestore 트랜잭션으로 닉네임 중복 검사 및 업데이트
      await runTransaction(db, async (transaction) => {
        const oldDisplayName = auth.displayName;

        // 4-1. 새 닉네임이 이미 사용 중인지 확인
        const newDisplayNameRef = doc(db, "usernames", newDisplayName);
        const newDisplayNameSnapshot = await transaction.get(newDisplayNameRef);
        if (newDisplayNameSnapshot.exists()) {
          throw new Error("이미 사용 중인 닉네임입니다.");
        }

        // 4-2. 기존 닉네임이 있다면 usernames 컬렉션에서 삭제
        if (oldDisplayName) {
          const oldDisplayNameRef = doc(db, "usernames", oldDisplayName);
          const oldDisplayNameSnapshot =
            await transaction.get(oldDisplayNameRef);
          if (oldDisplayNameSnapshot.exists()) {
            transaction.delete(oldDisplayNameRef);
          }
        }

        // 4-3. 새 닉네임을 usernames 컬렉션에 등록
        transaction.set(newDisplayNameRef, {
          uid: auth.uid,
          createdAt: serverTimestamp(),
        });

        // 4-4. users 컬렉션의 updatedAt 필드 업데이트
        const userRef = doc(db, "users", auth.uid);
        transaction.update(userRef, {
          updatedAt: serverTimestamp(),
        });
      });

      // 5. 성공 시 새 닉네임 반환
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
    updatePhotoURL(state, action: PayloadAction<string>) {
      if (state.auth) {
        state.auth.photoURL = action.payload;
      }
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

export const { setAuthUser, clearUser, updatePhotoURL } = userSlice.actions;
export default userSlice.reducer;
