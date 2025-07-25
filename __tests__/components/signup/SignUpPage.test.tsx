import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import SignUpPage from "app/sign-up/SignUpPage";
import { useAlert } from "store/context/alertContext";
import { useRouter } from "next/navigation";

const { useDuplicateCheck: RealUseDuplicateCheck } = jest.requireActual(
  "app/my-page/hooks/useDuplicateCheck",
);
import type { UseDuplicateCheckOptions } from "app/my-page/hooks/useDuplicateCheck";

// Mock dependencies
jest.mock("app/utils/api", () => ({
  checkDuplicate: jest.fn(),
}));
jest.mock("store/context/alertContext", () => ({
  useAlert: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("app/my-page/hooks/useDuplicateCheck", () => ({
  useDuplicateCheck: jest.fn(),
}));
jest.mock("firebase/auth");
jest.mock("firebase-config", () => ({
  isAuth: jest.fn(),
  db: jest.fn(),
}));

global.fetch = jest.fn();

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  updateProfile: jest.fn(() => Promise.resolve()),
}));

const mockUseAlert = useAlert as jest.MockedFunction<typeof useAlert>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseDuplicateCheck = jest.requireMock(
  "app/my-page/hooks/useDuplicateCheck",
).useDuplicateCheck;

const mockShowErrorHandler = jest.fn();
const mockShowSuccessHandler = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockCheckNickname = jest.fn();
const checkDuplicateMock = jest.fn();

beforeEach(() => {
  mockUseAlert.mockReturnValue({
    showErrorHandler: mockShowErrorHandler,
    showSuccessHandler: mockShowSuccessHandler,
    hideErrorHandler: jest.fn(),
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
  mockUseDuplicateCheck.mockReturnValue({
    check: mockCheckNickname,
    isChecking: false,
    isChecked: false,
    isAvailable: null,
    message: null,
  });
  checkDuplicateMock.mockReset();
  checkDuplicateMock.mockResolvedValue({
    available: true,
    message: "사용 가능한 이메일입니다.",
  });
  jest.clearAllMocks();
  (fetch as jest.Mock).mockClear();
});

describe("SignUpPage 필수 동작 시나리오", () => {
  test("닉네임 중복 확인 버튼이 정상 동작해야 한다", async () => {
    const user = userEvent.setup();
    render(<SignUpPage />);
    const nicknameInput = screen.getByLabelText("닉네임");
    const checkButtons = screen.getAllByText("중복 확인");
    const checkButton = checkButtons[0];
    await user.type(nicknameInput, "testnickname");
    await user.click(checkButton);
    expect(mockCheckNickname).toHaveBeenCalled();
  });

  test("이메일 중복 확인이 성공적으로 작동해야 한다", async () => {
    const user = userEvent.setup();
    mockUseDuplicateCheck.mockImplementation(
      (options: UseDuplicateCheckOptions) => {
        const real = RealUseDuplicateCheck({
          ...options,
          checkDuplicateFn: checkDuplicateMock,
        });
        return real;
      },
    );
    render(<SignUpPage />);
    const emailInput = screen.getByLabelText("이메일");
    const checkButtons = screen.getAllByText("중복 확인");
    const checkButton = checkButtons[1];
    await user.type(emailInput, "test@example.com");
    await user.click(checkButton);
    await waitFor(() => {
      expect(checkDuplicateMock).toHaveBeenCalledWith(
        "email",
        "test@example.com",
      );
    });
  });

  test("닉네임/이메일이 비어있을 때 중복 확인 버튼이 비활성화되어야 한다", () => {
    render(<SignUpPage />);
    const checkButtons = screen.getAllByText("중복 확인");
    expect(checkButtons[0]).toBeDisabled(); // 닉네임
    expect(checkButtons[1]).toBeDisabled(); // 이메일
  });

  test("모든 조건이 충족되지 않으면 회원가입 버튼이 비활성화되어야 한다", () => {
    render(<SignUpPage />);
    const signupButton = screen.getByRole("button", { name: /회원가입/ });
    expect(signupButton).toBeDisabled();
  });

  test("닉네임 중복 체크 실패 시 에러 핸들러가 호출되어야 한다", async () => {
    const user = userEvent.setup();

    // useDuplicateCheck가 에러 메시지를 반환하도록 mock 설정
    mockUseDuplicateCheck.mockImplementation(() => ({
      isChecking: false,
      isChecked: true,
      isAvailable: false,
      message: "이미 사용 중인 닉네임입니다.",
      check: jest.fn().mockResolvedValue(undefined), // check는 정상 완료
    }));

    render(<SignUpPage />);
    const nicknameInput = screen.getByLabelText("닉네임");
    const checkButton = screen.getAllByText("중복 확인")[0];

    await user.type(nicknameInput, "testnickname");
    await user.click(checkButton);

    await waitFor(() => {
      expect(mockShowErrorHandler).toHaveBeenCalledWith(
        "실패",
        "이미 사용 중인 닉네임입니다.",
      );
    });
  });
});
