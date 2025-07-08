import { POST } from "app/api/auth/signup/route";
import {
  createMockRequest,
  createMockSignupData,
  createMockUser,
  createMockFirebaseError,
} from "__tests__/utils/test-utils";
import { adminAuth, adminFirestore } from "firebase-admin-config";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
// 'jest.mock'을 사용하여 실제 Firebase 및 Next.js 모듈 대신 가짜 모듈을 사용합니다.
// 이를 통해 외부 서비스에 의존하지 않고 API 로직을 독립적으로 테스트할 수 있습니다.

jest.mock("firebase-admin-config", () => ({
  adminAuth: {
    // Firebase 인증 관련 함수들을 가짜 함수(jest.fn())로 대체합니다.
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    deleteUser: jest.fn(),
  },
  adminFirestore: {
    // Firestore 관련 함수들을 모킹합니다.
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
      })),
    })),
    // Firestore의 일괄 쓰기(batch) 작업도 모킹합니다.
    batch: jest.fn(() => ({
      set: jest.fn(),
      commit: jest.fn(),
    })),
  },
}));

// Next.js의 캐시 재검증 함수를 모킹합니다.
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// ==== 테스트 스위트(Test Suite): 회원가입 API ====
describe("/api/auth/signup", () => {
  let mockAdminAuth: any;
  let mockAdminFirestore: any;
  let mockBatch: any;
  let mockUsernameDoc: any;

  // ==== 테스트 준비: beforeEach ====
  // 각 테스트 케이스 실행 전에 환경을 초기화합니다.
  beforeEach(() => {
    jest.clearAllMocks(); // 모든 모킹 함수 호출 기록 삭제

    mockAdminAuth = adminAuth as any;
    mockAdminFirestore = adminFirestore as any;

    // 가짜 batch 객체 생성
    mockBatch = {
      set: jest.fn(),
      commit: jest.fn(),
    };

    // 가짜 닉네임 문서 객체 생성 (기본적으로는 존재하지 않는 상태)
    mockUsernameDoc = {
      exists: false,
    };

    // adminFirestore.batch() 호출 시 가짜 batch 객체 반환
    mockAdminFirestore.batch.mockReturnValue(mockBatch);
    // 닉네임 중복 확인 시 가짜 닉네임 문서 반환
    mockAdminFirestore.collection.mockReturnValue({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockUsernameDoc),
      })),
    } as any);
  });

  // ==== 테스트 케이스 그룹: 성공 시나리오 ====
  describe("성공 케이스", () => {
    it("올바른 데이터로 회원가입이 성공해야 합니다", async () => {
      // -- GIVEN (주어진 상황) --
      const signupData = createMockSignupData(); // 정상적인 회원가입 데이터
      const mockUser = createMockUser(); // 생성될 가짜 유저 정보

      // Firebase Auth의 createUser가 성공적으로 유저 정보를 반환하도록 설정
      mockAdminAuth.createUser.mockResolvedValue(mockUser as any);
      // Firestore의 batch commit이 성공하도록 설정
      mockBatch.commit.mockResolvedValue(undefined);

      const request = createMockRequest({
        method: "POST",
        body: signupData,
      });

      // -- WHEN (무엇을 했을 때) --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN (결과는 이래야 한다) --
      expect(response.status).toBe(201); // 201 Created 상태 코드 확인
      expect(result.success).toBe(true);
      expect(result.message).toBe("회원가입이 완료되었습니다.");
      expect(result.data.uid).toBe(mockUser.uid); // 반환된 데이터 검증

      // createUser 함수가 올바른 인자와 함께 호출되었는지 확인
      expect(mockAdminAuth.createUser).toHaveBeenCalledWith({
        email: signupData.email,
        password: signupData.password,
        displayName: signupData.displayName,
      });
    });
  });

  // ==== 테스트 케이스 그룹: 유효성 검증 실패 시나리오 ====
  describe("유효성 검증 실패 케이스", () => {
    it("필수 필드가 비어있으면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const invalidData = { displayName: "", email: "", password: "" };
      const request = createMockRequest({ body: invalidData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(400); // 400 Bad Request
      expect(result.error).toBe("모든 필드를 입력해주세요.");
    });

    it("닉네임이 2글자 미만이면 400 에러를 반환해야 합니다", async () => {
      // Given
      const invalidData = createMockSignupData({ displayName: "a" });
      const request = createMockRequest({
        method: "POST",
        body: invalidData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(result.error).toBe("닉네임은 2-30글자 사이여야 합니다.");
    });

    it("닉네임이 30글자 초과면 400 에러를 반환해야 합니다", async () => {
      // Given
      const longDisplayName = "a".repeat(31);
      const invalidData = createMockSignupData({
        displayName: longDisplayName,
      });
      const request = createMockRequest({
        method: "POST",
        body: invalidData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(result.error).toBe("닉네임은 2-30글자 사이여야 합니다.");
    });

    it("잘못된 이메일 형식이면 400 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const invalidData = createMockSignupData({ email: "invalid-email" });
      const request = createMockRequest({ body: invalidData, method: "POST" });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(400);
      expect(result.error).toBe("올바른 이메일 형식이 아닙니다.");
    });

    it("약한 비밀번호면 400 에러를 반환해야 합니다", async () => {
      // Given
      const invalidData = createMockSignupData({ password: "weak" });
      const request = createMockRequest({
        method: "POST",
        body: invalidData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(result.error).toBe(
        "비밀번호는 8자 이상이며, 숫자와 특수문자를 포함해야 합니다.",
      );
    });
  });

  // ==== 테스트 케이스 그룹: 중복 검사 실패 시나리오 ====
  describe("중복 검사 실패 케이스", () => {
    it("닉네임이 이미 사용 중이면 409 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      mockUsernameDoc.exists = true; // 닉네임이 이미 존재한다고 설정
      const request = createMockRequest({
        body: createMockSignupData(),
        method: "POST",
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(409); // 409 Conflict
      expect(result.error).toBe("이미 사용 중인 닉네임입니다.");
    });

    it("이메일이 이미 사용 중이면 409 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      const firebaseError = createMockFirebaseError(
        "auth/email-already-exists", // Firebase에서 이메일 중복 시 반환하는 에러 코드
        "Email already exists",
      );
      // createUser 호출 시 위에서 정의한 에러를 발생시키도록 설정
      mockAdminAuth.createUser.mockRejectedValue(firebaseError);

      const request = createMockRequest({
        body: createMockSignupData(),
        method: "POST",
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(409);
      expect(result.error).toBe("이미 사용 중인 이메일입니다.");
    });
  });

  // ==== 테스트 케이스 그룹: 에러 처리 및 롤백 시나리오 ====
  describe("Firebase 에러 처리", () => {
    it("Firebase Auth 에러가 발생하면 적절한 에러 메시지를 반환해야 합니다", async () => {
      // -- GIVEN --
      const firebaseError = createMockFirebaseError(
        "auth/invalid-email",
        "Invalid email",
      );
      mockAdminAuth.createUser.mockRejectedValue(firebaseError);

      const request = createMockRequest({
        body: createMockSignupData(),
        method: "POST",
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(400);
      expect(result.error).toBe("유효하지 않은 이메일입니다.");
    });

    it("Firestore 트랜잭션 실패 시 사용자 롤백을 수행해야 합니다", async () => {
      // -- GIVEN --
      const signupData = createMockSignupData();
      const mockUser = createMockUser();
      mockAdminAuth.createUser.mockResolvedValue(mockUser as any); // Auth 계정 생성은 성공
      mockBatch.commit.mockRejectedValue(new Error("Firestore error")); // DB 저장은 실패
      mockAdminAuth.getUserByEmail.mockResolvedValue(mockUser as any); // 롤백을 위한 유저 조회 성공
      mockAdminAuth.deleteUser.mockResolvedValue(undefined); // 유저 삭제 성공

      const request = createMockRequest({
        body: signupData,
        method: "POST",
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(500); // 500 Internal Server Error
      expect(result.error).toBe("회원가입 처리 중 오류가 발생했습니다.");
      // 롤백 로직이 정상적으로 실행되었는지 확인
      expect(mockAdminAuth.deleteUser).toHaveBeenCalledWith(mockUser.uid);
    });
  });

  describe("서버 에러 처리", () => {
    it("예상치 못한 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // Given
      const signupData = createMockSignupData();
      mockAdminFirestore.collection.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      const request = createMockRequest({
        method: "POST",
        body: signupData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(500);
      expect(result.error).toBe("회원가입 처리 중 오류가 발생했습니다.");
    });
  });
});
