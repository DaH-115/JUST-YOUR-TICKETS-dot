import { POST } from "app/api/auth/check-availability/route";
import {
  createMockRequest,
  createMockAvailabilityCheckData,
  createMockUser,
  createMockFirebaseError,
} from "__tests__/utils/test-utils";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { NextRequest } from "next/server";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
// 'jest.mock'을 사용하여 실제 Firebase 모듈 대신 가짜 모듈을 사용합니다.
// 이를 통해 외부 서비스에 의존하지 않고 API 로직을 독립적으로 테스트할 수 있습니다.

jest.mock("firebase-admin-config", () => ({
  adminAuth: {
    // Firebase 인증의 이메일로 유저를 찾는 함수를 모킹합니다.
    getUserByEmail: jest.fn(),
  },
  adminFirestore: {
    // Firestore의 문서 조회 관련 함수들을 모킹합니다.
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
  },
}));

// ==== 테스트 스위트(Test Suite): 닉네임/이메일 중복 확인 API ====
describe("/api/auth/check-availability", () => {
  let mockAdminAuth: any;
  let mockAdminFirestore: any;
  let mockUsernameDoc: any;

  // ==== 테스트 준비: beforeEach ====
  // 각 테스트 케이스 실행 전에 환경을 초기화합니다.
  beforeEach(() => {
    jest.clearAllMocks(); // 모든 모킹 함수 호출 기록 삭제

    mockAdminAuth = adminAuth as any;
    mockAdminFirestore = adminFirestore as any;

    // 가짜 닉네임 문서 객체 생성 (기본적으로는 존재하지 않는 상태)
    mockUsernameDoc = {
      exists: false,
    };

    // Firestore 닉네임 조회 시 기본적으로 '존재하지 않음'을 반환하도록 설정
    mockAdminFirestore.collection.mockReturnValue({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockUsernameDoc),
      })),
    } as any);
  });

  // ==== 테스트 케이스 그룹: 닉네임 중복 검사 ====
  describe("닉네임 중복 검사", () => {
    it("사용 가능한 닉네임이면 available: true를 반환해야 합니다", async () => {
      // -- GIVEN (주어진 상황) --
      const checkData = createMockAvailabilityCheckData({
        type: "displayName",
        value: "availableNickname",
      });
      const request = createMockRequest({ body: checkData, method: "POST" });
      // `mockUsernameDoc.exists`는 기본값이 false이므로, 닉네임이 존재하지 않는 상황입니다.

      // -- WHEN (무엇을 했을 때) --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN (결과는 이래야 한다) --
      expect(response.status).toBe(200);
      expect(result.available).toBe(true);
      expect(result.message).toBe("사용 가능한 닉네임입니다.");
    });

    it("이미 사용 중인 닉네임이면 available: false를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "displayName",
        value: "existingNickname",
      });
      mockUsernameDoc.exists = true; // 닉네임이 이미 존재한다고 설정

      const request = createMockRequest({ body: checkData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(200);
      expect(result.available).toBe(false);
      expect(result.message).toBe("이미 사용 중인 닉네임입니다.");
    });

    it("닉네임이 2글자 미만이면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "displayName",
        value: "a",
      });
      const request = createMockRequest({ body: checkData, method: "POST" });
      // ... WHEN, THEN은 위와 유사하므로 생략
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.error).toBe("닉네임은 2-30글자 사이여야 합니다.");
    });

    it("닉네임이 30글자 초과면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const longNickname = "a".repeat(31);
      const checkData = createMockAvailabilityCheckData({
        type: "displayName",
        value: longNickname,
      });
      const request = createMockRequest({ body: checkData, method: "POST" });
      // ... WHEN, THEN 생략
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.error).toBe("닉네임은 2-30글자 사이여야 합니다.");
    });
  });

  // ==== 테스트 케이스 그룹: 이메일 중복 검사 ====
  describe("이메일 중복 검사", () => {
    it("사용 가능한 이메일이면 available: true를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "email",
        value: "available@example.com",
      });
      // Firebase Auth에서 해당 이메일로 유저를 찾지 못하면 'auth/user-not-found' 에러가 발생합니다.
      // 이 에러는 곧 사용 가능한 이메일임을 의미합니다.
      const userNotFoundError = createMockFirebaseError(
        "auth/user-not-found",
        "User not found",
      );
      mockAdminAuth.getUserByEmail.mockRejectedValue(userNotFoundError);

      const request = createMockRequest({ body: checkData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(200);
      expect(result.available).toBe(true);
      expect(result.message).toBe("사용 가능한 이메일입니다.");
    });

    it("이미 사용 중인 이메일이면 available: false를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "email",
        value: "existing@example.com",
      });
      // getUserByEmail이 정상적으로 유저 정보를 반환하면, 해당 이메일이 이미 사용 중이라는 의미입니다.
      const mockUser = createMockUser({ email: "existing@example.com" });
      mockAdminAuth.getUserByEmail.mockResolvedValue(mockUser as any);

      const request = createMockRequest({ body: checkData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(200);
      expect(result.available).toBe(false);
      expect(result.message).toBe("이미 사용 중인 이메일입니다.");
    });

    it("잘못된 이메일 형식이면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "email",
        value: "invalid-email",
      });
      const request = createMockRequest({ body: checkData, method: "POST" });
      // ... WHEN, THEN 생략
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.error).toBe("올바른 이메일 형식이 아닙니다.");
    });
  });

  // ==== 테스트 케이스 그룹: 일반 유효성 검증 ====
  describe("유효성 검증 실패 케이스", () => {
    it("type 필드가 없으면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const invalidData = { value: "test" };
      const request = createMockRequest({ body: invalidData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(400);
      expect(result.error).toBe("type과 value가 필요합니다.");
    });

    it("value 필드가 없으면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const invalidData = { type: "displayName" };
      const request = createMockRequest({ body: invalidData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(400);
      expect(result.error).toBe("type과 value가 필요합니다.");
    });

    it("알 수 없는 type이면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const invalidData = { type: "invalid", value: "test" };
      const request = createMockRequest({ body: invalidData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(400);
      expect(result.error).toBe(
        "type은 'displayName' 또는 'email'이어야 합니다.",
      );
    });
  });

  // ==== 테스트 케이스 그룹: 서버 에러 처리 ====
  describe("서버 에러 케이스", () => {
    it("Firebase Auth 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "email",
        value: "error@example.com",
      });
      const firebaseError = createMockFirebaseError(
        "auth/internal-error",
        "Internal error",
      );
      mockAdminAuth.getUserByEmail.mockRejectedValue(firebaseError);

      const request = createMockRequest({ body: checkData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(500);
      expect(result.error).toBe("중복 검사 처리 중 오류가 발생했습니다.");
    });

    it("Firestore 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const checkData = createMockAvailabilityCheckData({
        type: "displayName",
        value: "error-nickname",
      });

      mockAdminFirestore.collection.mockImplementation(() => {
        throw new Error("Firestore error");
      });

      const request = createMockRequest({ body: checkData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(500);
      expect(result.error).toBe("중복 검사 처리 중 오류가 발생했습니다.");
    });
  });
});
