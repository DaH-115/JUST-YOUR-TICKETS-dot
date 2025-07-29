import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isAuth } from "firebase-config";

// 사용자 정보 타입 정의
export interface User {
  // Firebase Auth 정보
  uid: string | null;
  email: string | null;
  displayName: string | null;
  photoKey: string | null; // S3 이미지 Key만 사용합니다.

  // Firestore 메타데이터
  biography: string | null;
  provider: string | null;
  activityLevel: string;
  createdAt: string;
  updatedAt: string;

  // 사용자 통계 정보
  myTicketsCount: number;
  likedTicketsCount: number;
}

// Redux 상태 타입
type UserState = {
  user: User | null; // 사용자 정보 (null = 로그아웃 상태)
  status: "idle" | "loading" | "succeeded" | "failed"; // 로딩 상태
  error: string | null; // 에러 메시지
};

// 초기 상태
const initialState: UserState = {
  user: null,
  status: "idle",
  error: null,
};

// 사용자 프로필 조회 API
export const fetchUserProfile = createAsyncThunk<
  User, // 성공시 반환 타입
  string, // 매개변수 타입 (uid)
  { rejectValue: string } // 에러 타입
>("user/fetchUserProfile", async (uid, { rejectWithValue }) => {
  try {
    const user = isAuth.currentUser;
    if (!user) {
      return rejectWithValue("로그인이 필요합니다.");
    }

    const idToken = await user.getIdToken();
    const response = await fetch(`/api/users/${uid}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Firestore에 사용자 문서가 없으면 생성 요청 (최초 소셜 로그인 시)
        const providerId = user.providerData[0]?.providerId.split(".")[0];

        const setupResponse = await fetch("/api/auth/social-setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ provider: providerId }),
        });

        if (!setupResponse.ok) {
          throw new Error("사용자 프로필 생성에 실패했습니다.");
        }
        const setupData = await setupResponse.json();
        return {
          ...setupData.data, // uid, displayName, provider 등
          email: user.email, // email은 Auth에서 가져옴
        };
      }

      // 그 외의 오류는 이전처럼 폴백 처리
      console.warn(
        "API 호출 실패, Firebase Auth 정보로 폴백:",
        response.status,
      );
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoKey: null,
        biography: null,
        provider: null,
        activityLevel: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        myTicketsCount: 0,
        likedTicketsCount: 0,
      };
    }

    const data = await response.json();

    // Firebase Auth 정보와 Firestore 데이터를 하나로 통합
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoKey: data.photoKey,
      biography: data.biography,
      provider: data.provider,
      activityLevel: data.activityLevel,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      myTicketsCount: data.myTicketsCount,
      likedTicketsCount: data.likedTicketsCount,
    };
  } catch (error: unknown) {
    // 네트워크 에러 등의 경우에도 Firebase Auth 정보로 폴백
    const user = isAuth.currentUser;
    if (user) {
      console.warn(
        "네트워크 에러, Firebase Auth 정보로 폴백:",
        error instanceof Error ? error.message : "알 수 없는 오류",
      );
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoKey: null,
        biography: null,
        provider: null,
        activityLevel: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        myTicketsCount: 0,
        likedTicketsCount: 0,
      };
    }

    return rejectWithValue(
      error instanceof Error ? error.message : "알 수 없는 오류",
    );
  }
});

// 프로필 업데이트 요청 데이터 타입
interface UpdateProfileData {
  displayName?: string;
  biography?: string;
  photoKey?: string;
}

// 사용자 프로필 업데이트 API
export const updateUserProfile = createAsyncThunk<
  User, // 성공시 반환 타입
  { uid: string; data: UpdateProfileData }, // 매개변수 타입
  { rejectValue: string; state: { userData: UserState } } // 에러 타입 및 상태 타입 추가
>(
  "user/updateUserProfile",
  async ({ uid, data }, { rejectWithValue, getState }) => {
    try {
      const user = isAuth.currentUser;
      if (!user) {
        return rejectWithValue("로그인이 필요합니다.");
      }

      const idToken = await user.getIdToken();
      const response = await fetch(`/api/users/${uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "프로필 업데이트에 실패했습니다.");
      }

      const result = await response.json(); // e.g. { displayName?, biography?, photoKey? }

      // 업데이트된 Firebase Auth 정보 다시 가져오기
      await user.reload();
      const updatedUser = isAuth.currentUser!;
      const currentUserState = getState().userData.user;

      if (!currentUserState) {
        throw new Error("현재 사용자 정보를 찾을 수 없습니다.");
      }

      // 기존 상태를 기반으로 업데이트된 정보 병합
      return {
        ...currentUserState,
        uid: updatedUser.uid,
        email: updatedUser.email,
        displayName: updatedUser.displayName, // Auth에서 최신 정보 가져오기
        ...("biography" in result && { biography: result.biography }),
        ...("photoKey" in result && { photoKey: result.photoKey }),
        updatedAt: new Date().toISOString(), // 업데이트 시각 갱신
      };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "알 수 없는 오류",
      );
    }
  },
);

// Redux Slice 생성
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 로그인 시 사용자 정보 설정
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.status = "succeeded";
      state.error = null;
    },

    // 로그아웃 시 모든 정보 초기화
    clearUser(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },

    // 프로필 이미지만 빠르게 업데이트 (로컬 상태)
    updatePhotoKey(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.photoKey = action.payload;
      }
    },

    // 에러 상태 초기화
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 프로필 조회 처리
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "프로필 조회에 실패했습니다.";
      })

      // 프로필 업데이트 처리
      .addCase(updateUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "프로필 업데이트에 실패했습니다.";
      });
  },
});

// 액션과 리듀서 내보내기
export const { setUser, clearUser, updatePhotoKey, clearError } =
  userSlice.actions;
export default userSlice.reducer;

// 상태 선택자 (Selector) - 컴포넌트에서 쉽게 사용할 수 있도록
export const selectUser = (state: { userData: UserState }) =>
  state.userData.user;
export const selectUserStatus = (state: { userData: UserState }) =>
  state.userData.status;
export const selectUserError = (state: { userData: UserState }) =>
  state.userData.error;
export const selectIsLoggedIn = (state: { userData: UserState }) =>
  !!state.userData.user;
export const selectIsLoading = (state: { userData: UserState }) =>
  state.userData.status === "loading";
