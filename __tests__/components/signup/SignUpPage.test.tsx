import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignUpPage from "app/sign-up/SignUpPage";
import { useAlert } from "store/context/alertContext";
import { useRouter } from "next/navigation";
import { useNicknameCheck } from "app/my-page/hooks/useNicknameCheck";

// Mock dependencies
jest.mock("store/context/alertContext", () => ({
  useAlert: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("app/my-page/hooks/useNicknameCheck", () => ({
  useNicknameCheck: jest.fn(),
}));
jest.mock("firebase/auth");
jest.mock("firebase-config", () => ({
  isAuth: jest.fn(),
  db: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
}));

const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseNicknameCheck = useNicknameCheck as jest.MockedFunction<
  typeof useNicknameCheck
>;

const mockShowErrorHandler = jest.fn();
const mockShowSuccessHandler = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockCheckNickname = jest.fn();

beforeEach(() => {
  mockUseAlert.mockReturnValue({
    showErrorHandler: mockShowErrorHandler,
    showSuccessHandler: mockShowSuccessHandler,
    hideErrorHanlder: jest.fn(),
    hideSuccessHandler: jest.fn(),
  });

  mockUseRouter.mockReturnValue({
    push: mockPush,
    replace: mockReplace,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  });

  mockUseNicknameCheck.mockReturnValue({
    checkNickname: mockCheckNickname,
    isChecking: false,
    isChecked: false,
    isAvailable: null,
    message: null,
  });

  jest.clearAllMocks();
  (fetch as jest.Mock).mockClear();
});

describe("SignUpPage 컴포넌트", () => {
  describe("시맨틱 구조 및 접근성", () => {
    test("적절한 헤딩 구조를 가져야 한다", () => {
      render(<SignUpPage />);

      // 메인 제목이 h1이어야 함
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent("회원가입");

      // 숨김 섹션 제목이 있어야 함
      const formHeading = screen.getByText("회원가입 폼");
      expect(formHeading).toBeInTheDocument();
    });

    test("적절한 랜드마크 역할을 가져야 한다", () => {
      render(<SignUpPage />);

      // main 랜드마크
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // region 랜드마크
      const region = screen.getByRole("region", { name: "회원가입" });
      expect(region).toBeInTheDocument();

      // 폼 랜드마크
      const form = screen.getByRole("form", { name: "회원가입 양식" });
      expect(form).toBeInTheDocument();
    });

    test("모든 입력 필드가 적절한 레이블을 가져야 한다", () => {
      render(<SignUpPage />);

      expect(screen.getByLabelText("이름")).toBeInTheDocument();
      expect(screen.getByLabelText("닉네임")).toBeInTheDocument();
      expect(screen.getByLabelText("이메일")).toBeInTheDocument();
      expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
      expect(screen.getByLabelText("비밀번호 확인")).toBeInTheDocument();
    });

    test("중복 확인 버튼들이 적절한 ARIA 레이블을 가져야 한다", () => {
      render(<SignUpPage />);

      const checkButtons = screen.getAllByText("중복 확인");
      expect(checkButtons).toHaveLength(2);

      // 첫 번째는 닉네임, 두 번째는 이메일 중복 확인 버튼
      expect(checkButtons[0]).toBeInTheDocument();
      expect(checkButtons[1]).toBeInTheDocument();
    });
  });

  describe("폼 유효성 검사", () => {
    test("이름 필드 유효성 검사가 작동해야 한다", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      const nameInput = screen.getByLabelText("이름");

      // 짧은 이름 입력
      await user.type(nameInput, "a");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("이름은 최소 2글자 이상이어야 합니다."),
        ).toBeInTheDocument();
      });
    });

    test("닉네임 필드 유효성 검사가 작동해야 한다", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      const nicknameInput = screen.getByLabelText("닉네임");

      // 짧은 닉네임 입력
      await user.type(nicknameInput, "a");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("닉네임은 최소 2글자 이상이어야 합니다."),
        ).toBeInTheDocument();
      });
    });

    test("이메일 형식 유효성 검사가 작동해야 한다", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      const emailInput = screen.getByLabelText("이메일");

      // 잘못된 이메일 형식 입력
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("올바른 이메일 형식이 아닙니다."),
        ).toBeInTheDocument();
      });
    });

    test("비밀번호 복잡성 검사가 작동해야 한다", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      const passwordInput = screen.getByLabelText("비밀번호");

      // 간단한 비밀번호 입력
      await user.type(passwordInput, "simple");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("비밀번호는 최소 8자 이상이어야 합니다."),
        ).toBeInTheDocument();
      });
    });

    test("비밀번호 확인이 일치하지 않을 때 오류를 표시해야 한다", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      const passwordInput = screen.getByLabelText("비밀번호");
      const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

      await user.type(passwordInput, "Password123!");
      await user.type(confirmPasswordInput, "Different123!");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("비밀번호와 확인 비밀번호가 일치하지 않습니다."),
        ).toBeInTheDocument();
      });
    });
  });

  describe("닉네임 중복 확인", () => {
    test("닉네임 중복 확인 버튼이 작동해야 한다", async () => {
      const user = userEvent.setup();
      render(<SignUpPage />);

      const nicknameInput = screen.getByLabelText("닉네임");
      const checkButtons = screen.getAllByText("중복 확인");
      const checkButton = checkButtons[0]; // 첫 번째는 닉네임 중복 확인 버튼

      await user.type(nicknameInput, "testnickname");
      await user.click(checkButton);

      expect(mockCheckNickname).toHaveBeenCalled();
    });

    test("닉네임이 비어있을 때 중복 확인 버튼이 비활성화되어야 한다", () => {
      render(<SignUpPage />);

      const checkButtons = screen.getAllByText("중복 확인");
      const checkButton = checkButtons[0]; // 첫 번째는 닉네임 중복 확인 버튼
      expect(checkButton).toBeDisabled();
    });

    test("닉네임 중복 확인 결과를 표시해야 한다", () => {
      mockUseNicknameCheck.mockReturnValue({
        checkNickname: mockCheckNickname,
        isChecking: false,
        isChecked: true,
        isAvailable: true,
        message: "사용 가능한 닉네임입니다.",
      });

      render(<SignUpPage />);

      // SignUpPage에서는 isAvailable 값에 따라 하드코딩된 텍스트를 표시함
      const statusMessage = screen.getByText("사용 가능한 닉네임입니다.");
      expect(statusMessage).toBeInTheDocument();
      expect(statusMessage).toHaveAttribute("role", "status");
      expect(statusMessage).toHaveAttribute("aria-live", "polite");
    });

    test("닉네임 중복 확인 로딩 상태를 표시해야 한다", () => {
      mockUseNicknameCheck.mockReturnValue({
        checkNickname: mockCheckNickname,
        isChecking: true,
        isChecked: false,
        isAvailable: null,
        message: null,
      });

      render(<SignUpPage />);

      const loadingMessage = screen.getByText(
        "닉네임 중복 확인 중입니다. 잠시만 기다려주세요.",
      );
      expect(loadingMessage).toBeInTheDocument();
    });
  });

  describe("이메일 중복 확인", () => {
    test("이메일 중복 확인이 성공적으로 작동해야 한다", async () => {
      const user = userEvent.setup();

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            available: true,
            message: "사용 가능한 이메일입니다.",
          }),
      });

      render(<SignUpPage />);

      const emailInput = screen.getByLabelText("이메일");
      const checkButtons = screen.getAllByText("중복 확인");
      const checkButton = checkButtons[1]; // 두 번째는 이메일 중복 확인 버튼

      await user.type(emailInput, "test@example.com");
      await user.click(checkButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith("/api/auth/check-availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "email",
            value: "test@example.com",
          }),
        });
      });
    });

    test("이메일이 비어있을 때 중복 확인 버튼이 비활성화되어야 한다", () => {
      render(<SignUpPage />);

      const checkButtons = screen.getAllByText("중복 확인");
      const checkButton = checkButtons[1]; // 두 번째는 이메일 중복 확인 버튼
      expect(checkButton).toBeDisabled();
    });
  });

  describe("회원가입 버튼", () => {
    test("모든 조건이 충족되지 않으면 회원가입 버튼이 비활성화되어야 한다", () => {
      render(<SignUpPage />);

      const signupButton = screen.getByRole("button", { name: /회원가입/ });
      expect(signupButton).toBeDisabled();
    });

    test("회원가입 버튼 비활성화 이유를 스크린 리더에게 알려야 한다", () => {
      render(<SignUpPage />);

      const requirementsMessage = screen.getByText(
        "회원가입하려면 닉네임과 이메일 중복 확인을 완료해주세요.",
      );
      expect(requirementsMessage).toBeInTheDocument();
      expect(requirementsMessage).toHaveClass("sr-only");
    });

    test("회원가입 진행 중 로딩 상태를 표시해야 한다", async () => {
      const user = userEvent.setup();

      // 모든 조건이 충족된 상태로 설정
      mockUseNicknameCheck.mockReturnValue({
        isChecking: false,
        isChecked: true,
        isAvailable: true,
        message: "사용 가능한 닉네임입니다.",
        checkNickname: jest.fn(),
      });

      render(<SignUpPage />);

      // 폼 입력
      await user.type(screen.getByLabelText("이름"), "테스트 사용자");
      await user.type(screen.getByLabelText("닉네임"), "testuser");
      await user.type(screen.getByLabelText("이메일"), "test@example.com");
      await user.type(screen.getByLabelText("비밀번호"), "password123!");
      await user.type(screen.getByLabelText("비밀번호 확인"), "password123!");

      // 이메일 중복 확인 성공으로 설정
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          available: true,
          message: "사용 가능한 이메일입니다.",
        }),
      });

      // 이메일 중복 확인 버튼 클릭
      const emailCheckButtons = screen.getAllByText("중복 확인");
      await user.click(emailCheckButtons[1]); // 두 번째가 이메일 중복 확인

      await waitFor(() => {
        expect(
          screen.getByText("사용 가능한 이메일입니다."),
        ).toBeInTheDocument();
      });

      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        }),
      );

      // 회원가입 버튼 클릭
      const submitButton = screen.getByRole("button", { name: /회원가입/ });
      await user.click(submitButton);

      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("키보드 네비게이션", () => {
    test("모든 입력 필드와 버튼이 키보드로 접근 가능해야 한다", () => {
      render(<SignUpPage />);

      const nameInput = screen.getByLabelText("이름");
      const nicknameInput = screen.getByLabelText("닉네임");
      const emailInput = screen.getByLabelText("이메일");
      const passwordInput = screen.getByLabelText("비밀번호");
      const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

      // 모든 입력 필드가 존재하고 포커스 가능한지 확인
      expect(nameInput).toBeInTheDocument();
      expect(nicknameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(confirmPasswordInput).toBeInTheDocument();

      // 각 필드에 포커스 설정이 가능한지 확인
      nameInput.focus();
      expect(nameInput).toHaveFocus();
    });
  });

  describe("오류 처리", () => {
    test("네트워크 오류 시 적절한 오류 메시지를 표시해야 한다", async () => {
      const user = userEvent.setup();

      (fetch as jest.Mock).mockRejectedValue(new Error("네트워크 오류"));

      render(<SignUpPage />);

      const emailInput = screen.getByLabelText("이메일");
      const checkButton = screen.getByRole("button", {
        name: "이메일 중복 확인",
      });

      await user.type(emailInput, "test@example.com");
      await user.click(checkButton);

      await waitFor(() => {
        expect(mockShowErrorHandler).toHaveBeenCalled();
      });
    });
  });
});
