import { POST } from "app/api/auth/social-setup/route";
import {
  createMockRequest,
  createMockAuthToken,
  createMockUser,
  createMockSocialSetupData,
} from "__tests__/utils/test-utils";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";

// ==== 테스트 설정: 외부 모듈 모킹(Mocking) ====
// 테스트는 외부 서비스(DB, API)에 의존하지 않고 독립적으로 실행되어야 합니다.
// 'jest.mock'을 사용하면 실제 모듈 대신 가짜 모듈(mock)을 사용하도록 설정할 수 있습니다.

// Firebase Admin SDK의 기능을 모킹합니다. 실제 Firebase에 연결하지 않습니다.
jest.mock("firebase-admin-config", () => ({
  adminAuth: {
    // adminAuth의 getUser, updateUser 함수를 가짜 함수(jest.fn())로 대체합니다.
    getUser: jest.fn(),
    updateUser: jest.fn(),
  },
  adminFirestore: {
    // Firestore 관련 함수들을 모킹합니다.
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    })),
    // Firestore 트랜잭션도 가짜 함수로 대체합니다.
    runTransaction: jest.fn(),
  },
}));

// 우리가 직접 만든 인증 토큰 검증 함수를 모킹합니다.
jest.mock("lib/auth/verifyToken", () => ({
  verifyAuthToken: jest.fn(),
}));

// Next.js의 캐시 관련 함수를 모킹합니다.
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// ==== 테스트 스위트(Test Suite): API 라우트 테스트 ====
// 'describe'는 연관된 테스트들을 하나의 그룹으로 묶어주는 역할을 합니다.
// 여기서는 '/api/auth/social-setup' API에 대한 모든 테스트를 그룹화합니다.
describe("/api/auth/social-setup", () => {
  // 테스트에서 사용할 변수들을 미리 선언합니다.
  let mockAdminAuth: any;
  let mockAdminFirestore: any;
  let mockVerifyAuthToken: any;
  let mockUserDoc: any;

  // ==== 테스트 준비: beforeEach ====
  // 'beforeEach'는 그룹 내의 각 테스트가 실행되기 *직전에* 매번 실행됩니다.
  // 이를 통해 모든 테스트가 깨끗하고 독립적인 환경에서 시작되도록 보장합니다.
  beforeEach(() => {
    // jest.clearAllMocks(): 이전 테스트에서 기록된 모킹 함수의 호출 정보를 모두 초기화합니다.
    jest.clearAllMocks();

    // 모킹된 모듈들을 변수에 할당하여 테스트 케이스에서 쉽게 사용할 수 있도록 합니다.
    mockAdminAuth = adminAuth as any;
    mockAdminFirestore = adminFirestore as any;
    mockVerifyAuthToken = verifyAuthToken as any;

    // Firestore의 user 문서를 모킹합니다. 기본적으로는 존재하지 않는 상태(exists: false)로 설정합니다.
    mockUserDoc = {
      exists: false,
      data: jest.fn(),
    };

    // Firestore의 collection().doc()이 호출될 때, 모킹된 user 문서를 반환하도록 설정합니다.
    mockAdminFirestore.collection.mockReturnValue({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockUserDoc),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    } as any);

    // 대부분의 테스트는 인증이 성공한 상황을 가정하므로,
    // verifyAuthToken 함수가 항상 성공 결과를 반환하도록 기본값을 설정합니다.
    mockVerifyAuthToken.mockResolvedValue({
      success: true,
      uid: "test-user-id",
    });
  });

  // ==== 테스트 케이스 그룹: 성공 시나리오 ====
  describe("성공 케이스", () => {
    // 'it' 또는 'test'는 개별 테스트 케이스를 정의합니다.
    // 테스트 케이스는 "무엇을 해야 하는지" 명확하게 설명하는 것이 좋습니다.
    it("기존 사용자 로그인이 성공해야 합니다", async () => {
      // -- GIVEN (주어진 상황) --
      // 테스트에 필요한 데이터와 환경을 설정합니다.
      const socialSetupData = createMockSocialSetupData();
      mockUserDoc.exists = true; // 사용자가 이미 존재한다고 설정합니다.
      mockUserDoc.data.mockReturnValue({
        displayName: "Test User",
        provider: "google",
      });

      // API에 보낼 요청 객체를 생성합니다.
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });

      // -- WHEN (무엇을 했을 때) --
      // 테스트하려는 함수(여기서는 API 라우트 핸들러)를 실행합니다.
      const response = await POST(request);
      const result = await response.json();

      // -- THEN (결과는 이래야 한다) --
      // 'expect'를 사용하여 함수의 실행 결과가 예상과 일치하는지 검증합니다.
      expect(response.status).toBe(200); // HTTP 상태 코드가 200인지 확인
      expect(result.success).toBe(true); // 응답 데이터의 success 필드가 true인지 확인
      expect(result.message).toBe("로그인 성공");
      expect(result.data.isNewUser).toBe(false); // 기존 사용성이므로 isNewUser는 false
      expect(result.data.uid).toBe("test-user-id");
      expect(result.data.displayName).toBe("Test User");
      expect(result.data.provider).toBe("google");
    });

    it("신규 사용자 회원가입이 성공해야 합니다", async () => {
      // -- GIVEN --
      const socialSetupData = createMockSocialSetupData();
      const mockUser = createMockUser(); // 테스트용 유저 데이터 생성

      mockUserDoc.exists = false; // 신규 사용자이므로 Firestore에 문서가 없음
      mockAdminAuth.getUser.mockResolvedValue(mockUser as any); // Firebase Auth에는 정보가 있음
      mockAdminAuth.updateUser.mockResolvedValue(mockUser as any);

      // Firestore 트랜잭션을 모킹하여, 유니크한 닉네임 생성 로직이 성공하도록 설정
      mockAdminFirestore.runTransaction.mockImplementation(
        async (callback: any) => {
          return callback({
            get: jest.fn().mockResolvedValue({ exists: false }),
            set: jest.fn(),
          } as any);
        },
      );

      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(201); // 새로운 리소스가 생성되었으므로 201 상태 코드
      expect(result.success).toBe(true);
      expect(result.message).toBe("회원가입이 완료되었습니다.");
      expect(result.data.isNewUser).toBe(true); // 신규 사용자이므로 isNewUser는 true
      expect(result.data.uid).toBe("test-user-id");
      expect(result.data.provider).toBe("google");
      expect(result.data.displayName).toMatch(/^user\d+_[a-z0-9]+$/); // 랜덤 닉네임 형식 검증
    });
  });

  // ==== 테스트 케이스 그룹: 인증 실패 시나리오 ====
  describe("인증 실패 케이스", () => {
    it("인증 토큰이 없으면 401 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      // verifyAuthToken이 실패 결과를 반환하도록 설정
      mockVerifyAuthToken.mockResolvedValue({
        success: false,
        error: "로그인이 필요합니다.",
        statusCode: 401,
      });

      const socialSetupData = createMockSocialSetupData();
      const request = createMockRequest({
        method: "POST",
        body: socialSetupData,
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(401); // 401 Unauthorized 상태 코드
      expect(result.error).toBe("로그인이 필요합니다.");
    });

    it("잘못된 인증 토큰이면 401 에러를 반환해야 합니다", async () => {
      // Given
      mockVerifyAuthToken.mockResolvedValue({
        success: false,
        error: "유효하지 않은 토큰입니다.",
        statusCode: 401,
      });

      const socialSetupData = createMockSocialSetupData();
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: "Bearer invalid-token" },
        body: socialSetupData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(401);
      expect(result.error).toBe("유효하지 않은 토큰입니다.");
    });
  });

  describe("유효성 검증 실패 케이스", () => {
    it("provider가 없으면 400 에러를 반환해야 합니다", async () => {
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: {}, // provider가 없는 요청 본문
      });

      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(400); // 400 Bad Request 상태 코드
      expect(result.error).toBe("유효하지 않은 소셜 로그인 제공자입니다.");
    });

    it("유효하지 않은 provider면 400 에러를 반환해야 합니다", async () => {
      // Given
      const invalidData = createMockSocialSetupData({ provider: "invalid" });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: invalidData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(result.error).toBe("유효하지 않은 소셜 로그인 제공자입니다.");
    });

    it("지원하지 않는 provider면 400 에러를 반환해야 합니다", async () => {
      // Given
      const invalidData = createMockSocialSetupData({ provider: "facebook" });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: invalidData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(400);
      expect(result.error).toBe("유효하지 않은 소셜 로그인 제공자입니다.");
    });
  });

  describe("닉네임 생성 실패 케이스", () => {
    it("유일한 닉네임 생성에 실패하면 500 에러를 반환해야 합니다", async () => {
      // -- GIVEN --
      mockUserDoc.exists = false;
      mockAdminAuth.getUser.mockResolvedValue(createMockUser() as any);
      // 닉네임 생성 트랜잭션이 실패하도록 설정
      mockAdminFirestore.runTransaction.mockRejectedValue(
        new Error("Transaction failed"),
      );

      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: createMockSocialSetupData(),
      });

      // -- WHEN --
      const response = await POST(request);
      const result = await response.json();

      // -- THEN --
      expect(response.status).toBe(500); // 500 Internal Server Error 상태 코드
      expect(result.error).toBe("사용자 프로필 생성 중 오류가 발생했습니다.");
    });
  });

  describe("Firebase 에러 처리", () => {
    it("Firebase Auth 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // Given
      const socialSetupData = createMockSocialSetupData();

      mockUserDoc.exists = false;
      mockAdminAuth.getUser.mockRejectedValue(new Error("Firebase Auth error"));

      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(500);
      expect(result.error).toBe("사용자 프로필 생성 중 오류가 발생했습니다.");
    });

    it("Firestore 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // Given
      const socialSetupData = createMockSocialSetupData();

      mockAdminFirestore.collection.mockImplementation(() => {
        throw new Error("Firestore error");
      });

      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(500);
      expect(result.error).toBe("소셜 로그인 처리 중 오류가 발생했습니다.");
    });
  });

  describe("프로필 생성 실패 시 롤백", () => {
    it("프로필 생성 실패 시 생성된 닉네임을 롤백해야 합니다", async () => {
      // Given
      const socialSetupData = createMockSocialSetupData();
      const mockUser = createMockUser({ displayName: "generated-nickname" });

      mockUserDoc.exists = false;
      mockAdminAuth.getUser.mockResolvedValue(mockUser as any);
      mockAdminAuth.updateUser.mockResolvedValue(mockUser as any);

      // 닉네임 생성은 성공하지만 프로필 저장은 실패
      mockAdminFirestore.runTransaction.mockResolvedValue("generated-nickname");

      const mockDelete = jest.fn();
      mockAdminFirestore.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue(mockUserDoc),
          set: jest.fn().mockRejectedValue(new Error("Firestore set error")),
          update: jest.fn(),
          delete: mockDelete,
        })),
      } as any);

      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });

      // When
      const response = await POST(request);
      const result = await response.json();

      // Then
      expect(response.status).toBe(500);
      expect(result.error).toBe("사용자 프로필 생성 중 오류가 발생했습니다.");
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
