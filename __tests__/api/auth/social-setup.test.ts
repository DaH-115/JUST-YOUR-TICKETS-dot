import { POST } from "app/api/auth/social-setup/route";
import {
  createMockRequest,
  createMockAuthToken,
  createMockUser,
  createMockSocialSetupData,
} from "__tests__/utils/test-utils";
import { adminAuth, adminFirestore } from "firebase-admin-config";
import { verifyAuthToken } from "lib/auth/verifyToken";
import admin from "firebase-admin";

jest.mock("firebase-admin-config", () => ({
  adminAuth: {
    getUser: jest.fn(),
    updateUser: jest.fn(),
  },
  adminFirestore: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    })),
    runTransaction: jest.fn(),
  },
}));

jest.mock("lib/auth/verifyToken", () => ({
  verifyAuthToken: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("/api/auth/social-setup", () => {
  // 테스트에서 사용할 mock 객체 및 변수 선언
  let mockAdminAuth: Partial<admin.auth.Auth> & { [key: string]: unknown };
  let mockAdminFirestore: Partial<admin.firestore.Firestore> & {
    [key: string]: unknown;
  };
  let mockVerifyAuthToken: jest.Mock;
  let mockUserDoc: { exists: boolean; data: jest.Mock };

  beforeEach(() => {
    // 각 테스트 실행 전 mock 및 상태 초기화
    jest.clearAllMocks();
    mockAdminAuth = adminAuth as unknown as Partial<admin.auth.Auth> & {
      [key: string]: unknown;
    };
    mockAdminFirestore =
      adminFirestore as unknown as Partial<admin.firestore.Firestore> & {
        [key: string]: unknown;
      };
    mockVerifyAuthToken = verifyAuthToken as jest.Mock;
    // Firestore user 문서 mock (존재 여부 및 data 반환)
    mockUserDoc = {
      exists: false,
      data: jest.fn(),
    };
    (mockAdminFirestore.collection as jest.Mock).mockReturnValue({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue(mockUserDoc),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
    });
    // 기본적으로 인증 성공 상황으로 mock
    mockVerifyAuthToken.mockResolvedValue({
      success: true,
      uid: "test-user-id",
    });
  });

  describe("성공 케이스", () => {
    test("기존 사용자 로그인이 성공해야 합니다", async () => {
      // 이미 존재하는 사용자가 로그인 시 정상적으로 처리되는지 검증
      const socialSetupData = createMockSocialSetupData();
      mockUserDoc.exists = true;
      mockUserDoc.data.mockReturnValue({
        displayName: "Test User",
        provider: "google",
      });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toBe("로그인 성공");
      expect(result.data.isNewUser).toBe(false);
      expect(result.data.uid).toBe("test-user-id");
      expect(result.data.displayName).toBe("Test User");
      expect(result.data.provider).toBe("google");
    });

    test("신규 사용자 회원가입이 성공해야 합니다", async () => {
      // 신규 사용자가 회원가입 시 정상적으로 처리되는지 검증
      const socialSetupData = createMockSocialSetupData();
      const mockUser = createMockUser();
      mockUserDoc.exists = false;
      (mockAdminAuth.getUser as jest.Mock).mockResolvedValue(mockUser);
      (mockAdminAuth.updateUser as jest.Mock).mockResolvedValue(mockUser);
      (mockAdminFirestore.runTransaction as jest.Mock).mockImplementation(
        async (
          callback: (arg: {
            get: jest.Mock;
            set: jest.Mock;
          }) => Promise<unknown>,
        ) => {
          return callback({
            get: jest.fn().mockResolvedValue({ exists: false }),
            set: jest.fn(),
          });
        },
      );
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(201);
      expect(result.success).toBe(true);
      expect(result.message).toBe("회원가입이 완료되었습니다.");
      expect(result.data.isNewUser).toBe(true);
      expect(result.data.uid).toBe("test-user-id");
      expect(result.data.provider).toBe("google");
      expect(result.data.displayName).toMatch(/^user\d+_[a-z0-9]+$/);
    });
  });

  describe("인증 실패 케이스", () => {
    test("인증 토큰이 없으면 401 에러를 반환해야 합니다", async () => {
      // 인증 토큰이 없거나 인증 실패 시 401 에러 반환
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
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(401);
      expect(result.error).toBe("로그인이 필요합니다.");
    });

    test("잘못된 인증 토큰이면 401 에러를 반환해야 합니다", async () => {
      // 잘못된 토큰으로 요청 시 401 에러 반환
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
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(401);
      expect(result.error).toBe("유효하지 않은 토큰입니다.");
    });
  });

  describe("유효성 검증 실패 케이스", () => {
    test("provider가 없으면 400 에러를 반환해야 합니다", async () => {
      // provider 필드가 없을 때 400 에러 반환
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: {},
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.error).toBe("유효하지 않은 소셜 로그인 제공자입니다.");
    });

    test("유효하지 않은 provider면 400 에러를 반환해야 합니다", async () => {
      // 허용되지 않은 provider 값일 때 400 에러 반환
      const invalidData = createMockSocialSetupData({ provider: "invalid" });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: invalidData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.error).toBe("유효하지 않은 소셜 로그인 제공자입니다.");
    });

    test("지원하지 않는 provider면 400 에러를 반환해야 합니다", async () => {
      // 지원하지 않는 provider 값일 때 400 에러 반환
      const invalidData = createMockSocialSetupData({ provider: "facebook" });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: invalidData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(400);
      expect(result.error).toBe("유효하지 않은 소셜 로그인 제공자입니다.");
    });
  });

  describe("닉네임 생성 실패 케이스", () => {
    test("유일한 닉네임 생성에 실패하면 500 에러를 반환해야 합니다", async () => {
      // 닉네임 생성 트랜잭션 실패 시 500 에러 반환
      mockUserDoc.exists = false;
      (mockAdminAuth.getUser as jest.Mock).mockResolvedValue(createMockUser());
      (mockAdminFirestore.runTransaction as jest.Mock).mockRejectedValue(
        new Error("Transaction failed"),
      );
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: createMockSocialSetupData(),
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(500);
      expect(result.error).toBe("사용자 프로필 생성 중 오류가 발생했습니다.");
    });
  });

  describe("Firebase 에러 처리", () => {
    test("Firebase Auth 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // Firebase Auth에서 예외 발생 시 500 에러 반환
      const socialSetupData = createMockSocialSetupData();
      mockUserDoc.exists = false;
      (mockAdminAuth.getUser as jest.Mock).mockRejectedValue(
        new Error("Firebase Auth error"),
      );
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(500);
      expect(result.error).toBe("사용자 프로필 생성 중 오류가 발생했습니다.");
    });

    test("Firestore 에러가 발생하면 500 에러를 반환해야 합니다", async () => {
      // Firestore에서 예외 발생 시 500 에러 반환
      const socialSetupData = createMockSocialSetupData();
      (mockAdminFirestore.collection as jest.Mock).mockImplementation(() => {
        throw new Error("Firestore error");
      });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(500);
      expect(result.error).toBe("소셜 로그인 처리 중 오류가 발생했습니다.");
    });
  });

  describe("프로필 생성 실패 시 롤백", () => {
    test("프로필 생성 실패 시 생성된 닉네임을 롤백해야 합니다", async () => {
      // 프로필 저장 실패 시 닉네임 롤백 동작 검증
      const socialSetupData = createMockSocialSetupData();
      const mockUser = createMockUser({ displayName: "generated-nickname" });
      mockUserDoc.exists = false;
      (mockAdminAuth.getUser as jest.Mock).mockResolvedValue(mockUser);
      (mockAdminAuth.updateUser as jest.Mock).mockResolvedValue(mockUser);
      (mockAdminFirestore.runTransaction as jest.Mock).mockResolvedValue(
        "generated-nickname",
      );
      const mockDelete = jest.fn();
      (mockAdminFirestore.collection as jest.Mock).mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue(mockUserDoc),
          set: jest.fn().mockRejectedValue(new Error("Firestore set error")),
          update: jest.fn(),
          delete: mockDelete,
        })),
      });
      const request = createMockRequest({
        method: "POST",
        headers: { authorization: `Bearer ${createMockAuthToken()}` },
        body: socialSetupData,
      });
      const response = await POST(request);
      const result = await response.json();
      expect(response.status).toBe(500);
      expect(result.error).toBe("사용자 프로필 생성 중 오류가 발생했습니다.");
      expect(mockDelete).toHaveBeenCalled();
    });
  });
});
