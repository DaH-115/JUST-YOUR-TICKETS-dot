import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isAuth } from "firebase-config";
import { RootState } from "..";

export interface SerializableUser {
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  activityLevel?: string;
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
    // Firebase 사용자 토큰 가져오기
    const user = isAuth.currentUser;
    if (!user) {
      return rejectWithValue("사용자가 로그인되어 있지 않습니다.");
    }

    const idToken = await user.getIdToken();

    const response = await fetch(`/api/users/${uid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "사용자 정보 조회에 실패했습니다.");
    }

    const data = await response.json();

    return {
      provider: data.provider,
      biography: data.biography,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

interface UpdateUserMetaDataPayload {
  biography: string;
  updatedAt: string; // number → string
}

// API를 통한 사용자 프로필 업데이트 (biography 수정)
export const updateUserMetaData = createAsyncThunk<
  UpdateUserMetaDataPayload,
  { uid: string; data: { biography: string } },
  { rejectValue: string }
>("user/updateUserMetaData", async ({ uid, data }, { rejectWithValue }) => {
  try {
    // Firebase 사용자 토큰 가져오기
    const user = isAuth.currentUser;
    if (!user) {
      return rejectWithValue("사용자가 로그인되어 있지 않습니다.");
    }

    const idToken = await user.getIdToken();

    const response = await fetch(`/api/users/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ biography: data.biography }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "프로필 업데이트에 실패했습니다.");
    }

    const result = await response.json();

    return {
      biography: result.data.biography,
      updatedAt: result.data.updatedAt,
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
      // 3. API를 통한 displayName 업데이트
      const idToken = await firebaseUser.getIdToken();

      const response = await fetch(`/api/users/${auth.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ displayName: newDisplayName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "닉네임 업데이트에 실패했습니다.");
      }

      const result = await response.json();

      // 4. 성공 시 새 닉네임 반환
      return result.data.displayName;
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
