interface ErrorMessage {
  title: string;
  message: string;
}

// Firebase 에러 메시지 맵
const firebaseErrorMessages: Record<string, ErrorMessage> = {
  // Auth 관련 에러
  "auth/wrong-password": {
    title: "비밀번호 오류",
    message: "현재 비밀번호가 올바르지 않습니다.",
  },
  "auth/too-many-requests": {
    title: "요청 제한",
    message: "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.",
  },
  "auth/requires-recent-login": {
    title: "재인증 필요",
    message: "보안을 위해 다시 로그인해주세요.",
  },
  "auth/network-request-failed": {
    title: "네트워크 오류",
    message: "네트워크 연결을 확인해주세요.",
  },
  "auth/user-not-found": {
    title: "사용자 없음",
    message: "존재하지 않는 사용자입니다.",
  },
  "auth/email-already-in-use": {
    title: "이메일 중복",
    message: "이미 사용 중인 이메일입니다.",
  },
};

// Firestore 에러 메시지 맵
const firestoreErrorMessages: Record<string, ErrorMessage> = {
  // 권한 관련
  "permission-denied": {
    title: "권한 오류",
    message: "리뷰 데이터에 접근할 권한이 없습니다. 다시 로그인해주세요.",
  },

  // 네트워크/서버 관련
  unavailable: {
    title: "서버 연결 실패",
    message: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
  },
  cancelled: {
    title: "작업 취소",
    message: "네트워크 상태를 확인해주세요.",
  },

  // 인증 관련
  unauthenticated: {
    title: "인증 만료",
    message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
  },

  // 쿼리/데이터 관련
  "invalid-argument": {
    title: "잘못된 요청",
    message: "잘못된 검색 조건입니다. 다시 시도해주세요.",
  },
  "failed-precondition": {
    title: "쿼리 실패",
    message: "데이터 조회 조건이 충족되지 않았습니다.",
  },

  // 리소스 관련
  "resource-exhausted": {
    title: "요청 한도 초과",
    message: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  },

  // 기타
  internal: {
    title: "내부 오류",
    message: "내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  },
  "not-found": {
    title: "데이터 없음",
    message: "요청하신 데이터를 찾을 수 없습니다.",
  },
};

// 커스텀 비즈니스 에러 메시지 맵
const customErrorMessages: Record<string, ErrorMessage> = {
  // 리뷰 관련
  "review/create-failed": {
    title: "리뷰 생성 실패",
    message: "리뷰를 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  "review/update-failed": {
    title: "리뷰 수정 실패",
    message: "리뷰를 수정하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  "review/delete-failed": {
    title: "리뷰 삭제 실패",
    message: "리뷰를 삭제하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  // 댓글 관련
  "comment/create-failed": {
    title: "댓글 등록 실패",
    message: "댓글을 등록하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  "comment/update-failed": {
    title: "댓글 수정 실패",
    message: "댓글을 수정하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  "comment/delete-failed": {
    title: "댓글 삭제 실패",
    message: "댓글을 삭제하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  // 프로필 관련
  "profile/update-failed": {
    title: "프로필 수정 실패",
    message: "프로필을 수정하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
  },
  // 기타
  "network-failed": {
    title: "네트워크 오류",
    message: "네트워크 연결에 실패했습니다. 인터넷 상태를 확인해주세요.",
  },
};

export const firebaseErrorHandler = (error: unknown): ErrorMessage => {
  const defaultError = {
    title: "오류 발생",
    message: "처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  };

  if (!error) return defaultError;

  // 커스텀 에러 코드 처리
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    if (code.startsWith("auth/")) {
      return firebaseErrorMessages[code] || defaultError;
    }
    if (customErrorMessages[code]) {
      return customErrorMessages[code];
    }
    return firestoreErrorMessages[code] || defaultError;
  }

  // 일반 Error 객체 (message가 커스텀 코드일 수 있음)
  if (error instanceof Error) {
    if (customErrorMessages[error.message]) {
      return customErrorMessages[error.message];
    }
    return {
      title: "에러",
      message: error.message || defaultError.message,
    };
  }

  return defaultError;
};
