import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginPage from "app/login/components/LoginPage";
import { useAlert } from "store/context/alertContext";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

// Mock dependencies
jest.mock("store/context/alertContext", () => ({
  useAlert: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(
    () => new Promise((resolve) => setTimeout(resolve, 100)),
  ),
  signInWithPopup: jest.fn(
    () => new Promise((resolve) => setTimeout(resolve, 100)),
  ),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
}));
jest.mock("firebase-config", () => ({
  isAuth: jest.fn(),
}));

const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSignInWithEmailAndPassword =
  signInWithEmailAndPassword as jest.MockedFunction<
    typeof signInWithEmailAndPassword
  >;
const mockSignInWithPopup = signInWithPopup as jest.MockedFunction<
  typeof signInWithPopup
>;

const mockShowErrorHandler = jest.fn();
const mockShowSuccessHandler = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

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

  jest.clearAllMocks();

  // Firebase mocks
  mockSignInWithEmailAndPassword.mockResolvedValue({
    user: { uid: "test-uid" },
  } as never);
  mockSignInWithPopup.mockResolvedValue({
    user: { uid: "test-uid" },
  } as never);
});

describe("LoginPage 컴포넌트", () => {
  describe("시맨틱 구조 및 접근성", () => {
    test("적절한 헤딩 구조를 가져야 한다", () => {
      render(<LoginPage />);

      // 메인 제목이 h1이어야 함
      const mainHeading = screen.getByRole("heading", { level: 1 });
      expect(mainHeading).toHaveTextContent("로그인");

      // 숨김 섹션 제목들이 있어야 함
      const formHeading = screen.getByText("로그인 폼");
      const socialHeading = screen.getByText("소셜 로그인");
      expect(formHeading).toBeInTheDocument();
      expect(socialHeading).toBeInTheDocument();
    });

    test("적절한 랜드마크 역할을 가져야 한다", () => {
      render(<LoginPage />);

      // main 랜드마크
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // region 랜드마크
      const region = screen.getByRole("region", { name: "로그인" });
      expect(region).toBeInTheDocument();

      // 폼 랜드마크
      const form = screen.getByRole("form", { name: "로그인 양식" });
      expect(form).toBeInTheDocument();
    });

    test("적절한 ARIA 레이블을 가져야 한다", () => {
      render(<LoginPage />);

      // 로그인 상태 유지 체크박스
      const checkbox = screen.getByLabelText("로그인 상태 유지");
      expect(checkbox).toHaveAttribute(
        "aria-describedby",
        "rememberMe-description",
      );

      // 소셜 로그인 그룹
      const socialGroup = screen.getByRole("group", {
        name: "소셜 로그인 옵션",
      });
      expect(socialGroup).toBeInTheDocument();
    });

    test("키보드 네비게이션이 가능해야 한다", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText("이메일");
      const passwordInput = screen.getByLabelText("비밀번호");
      const checkbox = screen.getByLabelText("로그인 상태 유지");
      const loginButton = screen.getByRole("button", { name: "로그인" });

      // Tab으로 순차적 이동
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(checkbox).toHaveFocus();

      await user.tab();
      expect(loginButton).toHaveFocus();
    });
  });

  describe("폼 기능", () => {
    test("유효한 입력으로 폼을 제출할 수 있어야 한다", async () => {
      // Firebase 함수가 pending 상태로 유지되도록 모킹
      let resolveSignIn: (value: UserCredential) => void;
      const pendingPromise = new Promise<UserCredential>((resolve) => {
        resolveSignIn = resolve;
      });
      mockSignInWithEmailAndPassword.mockReturnValueOnce(pendingPromise);

      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText("이메일");
      const passwordInput = screen.getByLabelText("비밀번호");
      const loginButton = screen.getByRole("button", { name: "로그인" });

      // 유효한 데이터 입력
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // 폼 제출
      await user.click(loginButton);

      // 버튼 텍스트가 로딩 상태로 변경되어야 함
      await waitFor(() => {
        expect(screen.getByText("로그인 중...")).toBeInTheDocument();
      });

      // 로딩 상태가 확인되었으니 Promise를 완료하여 cleanup
      resolveSignIn!({ user: { uid: "test-uid" } } as UserCredential);
    });

    test("유효하지 않은 이메일 형식에 대해 오류를 표시해야 한다", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText("이메일");
      const passwordInput = screen.getByLabelText("비밀번호");

      // 잘못된 이메일 형식 입력
      await user.type(emailInput, "invalid-email");
      await user.type(passwordInput, "password123");

      // 다른 필드로 이동하여 유효성 검사 트리거
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("올바른 이메일 형식이 아닙니다."),
        ).toBeInTheDocument();
      });
    });

    test("짧은 비밀번호에 대해 오류를 표시해야 한다", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const passwordInput = screen.getByLabelText("비밀번호");

      // 짧은 비밀번호 입력
      await user.type(passwordInput, "123");

      // 다른 필드로 이동하여 유효성 검사 트리거
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("비밀번호는 최소 8자 이상이어야 합니다."),
        ).toBeInTheDocument();
      });
    });

    test("로그인 상태 유지 체크박스가 작동해야 한다", async () => {
      const user = userEvent.setup();
      render(<LoginPage />);

      const checkbox = screen.getByLabelText("로그인 상태 유지");

      // 초기에는 체크되지 않음
      expect(checkbox).not.toBeChecked();

      // 체크박스 클릭
      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      // 다시 클릭하면 체크 해제
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("소셜 로그인", () => {
    test("Google 로그인 버튼이 존재해야 한다", () => {
      render(<LoginPage />);

      const googleButton = screen.getByRole("button", {
        name: "Google로 계속하기 로그인",
      });
      expect(googleButton).toBeInTheDocument();
    });

    test("GitHub 로그인 버튼이 존재해야 한다", () => {
      render(<LoginPage />);

      const githubButton = screen.getByRole("button", {
        name: "GitHub로 계속하기 로그인",
      });
      expect(githubButton).toBeInTheDocument();
    });

    test("소셜 로그인 버튼 클릭 시 로딩 상태를 표시해야 한다", async () => {
      // Firebase 소셜 로그인 함수가 pending 상태로 유지되도록 모킹
      let resolveSocialLogin: (value: UserCredential) => void;
      const pendingSocialPromise = new Promise<UserCredential>((resolve) => {
        resolveSocialLogin = resolve;
      });
      mockSignInWithPopup.mockReturnValueOnce(pendingSocialPromise);

      const user = userEvent.setup();
      render(<LoginPage />);

      const googleButton = screen.getByRole("button", {
        name: "Google로 계속하기 로그인",
      });

      await user.click(googleButton);

      // 로딩 상태 확인
      await waitFor(() => {
        expect(screen.getByText("Google로 계속하기 중...")).toBeInTheDocument();
      });

      // 로딩 상태가 확인되었으니 Promise를 완료하여 cleanup
      resolveSocialLogin!({ user: { uid: "test-uid" } } as UserCredential);
    });
  });

  describe("로딩 상태 및 접근성", () => {
    test("로딩 중일 때 스크린 리더용 메시지를 제공해야 한다", async () => {
      // Firebase 함수가 pending 상태로 유지되도록 모킹
      let resolveSignIn: (value: UserCredential) => void;
      const pendingPromise = new Promise<UserCredential>((resolve) => {
        resolveSignIn = resolve;
      });
      mockSignInWithEmailAndPassword.mockReturnValueOnce(pendingPromise);

      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText("이메일");
      const passwordInput = screen.getByLabelText("비밀번호");
      const loginButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(loginButton);

      // 스크린 리더용 로딩 메시지 확인
      await waitFor(() => {
        expect(
          screen.getByText("로그인을 처리하고 있습니다. 잠시만 기다려주세요."),
        ).toBeInTheDocument();
      });

      // 로딩 상태가 확인되었으니 Promise를 완료하여 cleanup
      resolveSignIn!({ user: { uid: "test-uid" } } as UserCredential);
    });

    test("로딩 중일 때 폼 입력이 비활성화되어야 한다", async () => {
      // Firebase 함수가 pending 상태로 유지되도록 모킹
      let resolveSignIn: (value: UserCredential) => void;
      const pendingPromise = new Promise<UserCredential>((resolve) => {
        resolveSignIn = resolve;
      });
      mockSignInWithEmailAndPassword.mockReturnValueOnce(pendingPromise);

      const user = userEvent.setup();
      render(<LoginPage />);

      const emailInput = screen.getByLabelText("이메일");
      const passwordInput = screen.getByLabelText("비밀번호");
      const loginButton = screen.getByRole("button", { name: "로그인" });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");

      // 로그인 버튼 클릭
      await user.click(loginButton);

      // 로딩 상태에서 입력 필드들이 비활성화되어야 함
      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(loginButton).toBeDisabled();
      });

      // 로딩 상태가 확인되었으니 Promise를 완료하여 cleanup
      resolveSignIn!({ user: { uid: "test-uid" } } as UserCredential);
    });
  });

  describe("회원가입 링크", () => {
    test("회원가입 버튼이 존재해야 한다", () => {
      render(<LoginPage />);

      const signupButton = screen.getByRole("button", { name: "회원가입" });
      expect(signupButton).toBeInTheDocument();
    });

    test("회원가입 버튼이 올바른 링크를 가져야 한다", () => {
      render(<LoginPage />);

      const signupLink = screen.getByRole("link");
      expect(signupLink).toHaveAttribute("href", "/sign-up");
    });
  });
});
