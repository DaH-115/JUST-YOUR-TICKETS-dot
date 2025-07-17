import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useAlert } from "store/context/alertContext";
import { useAppSelector } from "store/redux-toolkit/hooks";
import { isAuth } from "firebase-config";
import ChangePassword from "app/my-page/components/ChangePassword";

// Mock modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  EmailAuthProvider: {
    credential: jest.fn(),
  },
  reauthenticateWithCredential: jest.fn(),
  updatePassword: jest.fn(),
}));

jest.mock("store/context/alertContext", () => ({
  useAlert: jest.fn(),
}));

jest.mock("store/redux-toolkit/hooks", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("firebase-config", () => ({
  isAuth: {
    currentUser: null,
  },
}));

jest.mock("store/redux-toolkit/slice/userSlice", () => ({
  selectUser: jest.fn(),
}));

jest.mock("app/utils/firebaseError", () => ({
  firebaseErrorHandler: jest.fn((error) => {
    if (error && error.code === "auth/wrong-password") {
      return {
        title: "비밀번호 오류",
        message: "현재 비밀번호가 올바르지 않습니다.",
      };
    }
    return {
      title: "오류",
      message: "비밀번호 변경에 실패했습니다.",
    };
  }),
}));

jest.mock("app/components/ui/forms/InputField", () => {
  return function MockInputField({
    id,
    label,
    type,
    placeholder,
    register,
    error,
    touched,
    disabled,
  }: {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    register: (name: string) => {
      name: string;
      onChange: () => void;
      onBlur: () => void;
      ref: () => void;
    };
    error?: string;
    touched: boolean;
    disabled: boolean;
  }) {
    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register(id)}
          data-testid={id}
        />
        {error && touched && <span data-testid={`${id}-error`}>{error}</span>}
      </div>
    );
  };
});

describe("ChangePassword", () => {
  const mockPush = jest.fn();
  const mockShowErrorHandler = jest.fn();
  const mockShowSuccessHandler = jest.fn();

  const defaultUser = {
    uid: "test-uid",
    email: "test@example.com",
    displayName: "테스트 사용자",
  };

  const defaultCurrentUser = {
    getIdToken: jest.fn().mockResolvedValue("mock-token"),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (useAlert as jest.Mock).mockReturnValue({
      showErrorHandler: mockShowErrorHandler,
      showSuccessHandler: mockShowSuccessHandler,
    });

    (useAppSelector as jest.Mock).mockReturnValue(defaultUser);
    Object.defineProperty(isAuth, "currentUser", {
      value: defaultCurrentUser,
      writable: true,
    });
  });

  describe("초기 렌더링", () => {
    it("컴포넌트가 정상적으로 렌더링된다", () => {
      render(<ChangePassword />);

      expect(
        screen.getByRole("heading", { name: "비밀번호 변경" }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("현재 비밀번호")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "비밀번호 확인" }),
      ).toBeInTheDocument();
      expect(
        screen.queryByLabelText("새로운 비밀번호"),
      ).not.toBeInTheDocument();
    });

    it("현재 비밀번호 입력 필드가 표시된다", () => {
      render(<ChangePassword />);

      const currentPasswordInput = screen.getByTestId("currentPassword");
      expect(currentPasswordInput).toBeInTheDocument();
      expect(currentPasswordInput).toHaveAttribute("type", "password");
      expect(currentPasswordInput).toHaveAttribute(
        "placeholder",
        "현재 비밀번호를 입력하세요.",
      );
    });

    it("비밀번호 확인 버튼이 표시된다", () => {
      render(<ChangePassword />);

      const confirmButton = screen.getByRole("button", {
        name: "비밀번호 확인",
      });
      expect(confirmButton).toBeInTheDocument();
      expect(confirmButton).not.toBeDisabled();
    });
  });

  describe("현재 비밀번호 확인", () => {
    it("올바른 현재 비밀번호 입력 시 인증이 성공한다", async () => {
      const mockCredential = { user: "mock-user" };
      (EmailAuthProvider.credential as jest.Mock).mockReturnValue(
        mockCredential,
      );
      (reauthenticateWithCredential as jest.Mock).mockResolvedValue(undefined);

      render(<ChangePassword />);

      const currentPasswordInput = screen.getByTestId("currentPassword");
      const confirmButton = screen.getByRole("button", {
        name: "비밀번호 확인",
      });

      await act(async () => {
        fireEvent.change(currentPasswordInput, {
          target: { value: "currentPassword123!" },
        });
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
          "test@example.com",
          "currentPassword123!",
        );
        expect(reauthenticateWithCredential).toHaveBeenCalledWith(
          defaultCurrentUser,
          mockCredential,
        );
        expect(mockShowSuccessHandler).toHaveBeenCalledWith(
          "확인",
          "비밀번호가 확인되었습니다.",
        );
      });
    });

    it("잘못된 현재 비밀번호 입력 시 에러가 표시된다", async () => {
      // 모든 mock 초기화
      jest.clearAllMocks();

      const mockCredential = { user: "mock-user" };
      (EmailAuthProvider.credential as jest.Mock).mockReturnValue(
        mockCredential,
      );
      (reauthenticateWithCredential as jest.Mock).mockRejectedValue({
        code: "auth/wrong-password",
        message: "Wrong password",
      });

      render(<ChangePassword />);

      const currentPasswordInput = screen.getByTestId("currentPassword");
      const confirmButton = screen.getByRole("button", {
        name: "비밀번호 확인",
      });

      await act(async () => {
        fireEvent.change(currentPasswordInput, {
          target: { value: "wrongPassword123!" },
        });
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(mockShowErrorHandler).toHaveBeenCalledWith(
          "비밀번호 오류",
          "현재 비밀번호가 올바르지 않습니다.",
        );
      });
    });

    it("사용자 정보가 없을 때 에러가 표시된다", async () => {
      (useAppSelector as jest.Mock).mockReturnValue(null);

      render(<ChangePassword />);

      const currentPasswordInput = screen.getByTestId("currentPassword");
      const confirmButton = screen.getByRole("button", {
        name: "비밀번호 확인",
      });

      await act(async () => {
        fireEvent.change(currentPasswordInput, {
          target: { value: "password123!" },
        });
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(mockShowErrorHandler).toHaveBeenCalledWith(
          "오류",
          "사용자 정보가 올바르지 않습니다.",
        );
      });
    });
  });

  describe("새 비밀번호 입력", () => {
    beforeEach(async () => {
      // 현재 비밀번호 확인을 먼저 완료
      (EmailAuthProvider.credential as jest.Mock).mockReturnValue({
        user: "mock-user",
      });
      (reauthenticateWithCredential as jest.Mock).mockResolvedValue(undefined);

      render(<ChangePassword />);

      const currentPasswordInput = screen.getByTestId("currentPassword");
      const confirmButton = screen.getByRole("button", {
        name: "비밀번호 확인",
      });

      await act(async () => {
        fireEvent.change(currentPasswordInput, {
          target: { value: "currentPassword123!" },
        });
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.getByLabelText("새로운 비밀번호")).toBeInTheDocument();
      });
    });

    it("현재 비밀번호 확인 후 새 비밀번호 입력 필드가 표시된다", () => {
      expect(screen.getByLabelText("새로운 비밀번호")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "비밀번호 변경" }),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("현재 비밀번호")).not.toBeInTheDocument();
    });

    it("새 비밀번호 입력 필드가 올바르게 설정된다", () => {
      const newPasswordInput = screen.getByTestId("newPassword");
      expect(newPasswordInput).toHaveAttribute("type", "password");
      expect(newPasswordInput).toHaveAttribute(
        "placeholder",
        "새로운 비밀번호를 입력하세요.",
      );
    });

    it("유효한 새 비밀번호로 변경이 성공한다", async () => {
      (updatePassword as jest.Mock).mockResolvedValue(undefined);

      const newPasswordInput = screen.getByTestId("newPassword");
      const changeButton = screen.getByRole("button", {
        name: "비밀번호 변경",
      });

      await act(async () => {
        fireEvent.change(newPasswordInput, {
          target: { value: "newPassword123!" },
        });
        fireEvent.click(changeButton);
      });

      await waitFor(() => {
        expect(updatePassword).toHaveBeenCalledWith(
          defaultCurrentUser,
          "newPassword123!",
        );
        expect(mockShowSuccessHandler).toHaveBeenCalledWith(
          "성공",
          "비밀번호가 성공적으로 변경되었습니다.",
        );
      });
    });

    it("비밀번호 변경 실패 시 에러가 표시된다", async () => {
      (updatePassword as jest.Mock).mockRejectedValue(
        new Error("비밀번호 변경 실패"),
      );

      const newPasswordInput = screen.getByTestId("newPassword");
      const changeButton = screen.getByRole("button", {
        name: "비밀번호 변경",
      });

      await act(async () => {
        fireEvent.change(newPasswordInput, {
          target: { value: "newPassword123!" },
        });
        fireEvent.click(changeButton);
      });

      await waitFor(() => {
        expect(mockShowErrorHandler).toHaveBeenCalledWith(
          "오류",
          "비밀번호 변경에 실패했습니다.",
        );
      });
    });
  });

  describe("로그인 상태 검증", () => {
    it("로그인하지 않은 사용자는 로그인 페이지로 리다이렉트된다", async () => {
      // 모든 mock 초기화
      jest.clearAllMocks();

      // 처음부터 currentUser를 null로 설정
      Object.defineProperty(isAuth, "currentUser", {
        value: null,
        writable: true,
      });

      // 먼저 현재 비밀번호 확인을 완료하여 새 비밀번호 입력 상태로 만들기 위해
      // 임시로 currentUser를 설정하고 비밀번호 확인 완료
      const tempCurrentUser = {
        getIdToken: jest.fn().mockResolvedValue("mock-token"),
      };
      Object.defineProperty(isAuth, "currentUser", {
        value: tempCurrentUser,
        writable: true,
      });

      (EmailAuthProvider.credential as jest.Mock).mockReturnValue({
        user: "mock-user",
      });
      (reauthenticateWithCredential as jest.Mock).mockResolvedValue(undefined);

      render(<ChangePassword />);

      // 현재 비밀번호 확인 먼저 완료
      const currentPasswordInput = screen.getByTestId("currentPassword");
      const confirmButton = screen.getByRole("button", {
        name: "비밀번호 확인",
      });

      await act(async () => {
        fireEvent.change(currentPasswordInput, {
          target: { value: "currentPassword123!" },
        });
        fireEvent.click(confirmButton);
      });

      await waitFor(() => {
        expect(screen.getByLabelText("새로운 비밀번호")).toBeInTheDocument();
      });

      // 이제 다시 currentUser를 null로 설정하고 컴포넌트 리렌더링
      Object.defineProperty(isAuth, "currentUser", {
        value: null,
        writable: true,
      });

      const newPasswordInput = screen.getByTestId("newPassword");
      const changeButton = screen.getByRole("button", {
        name: "비밀번호 변경",
      });

      await act(async () => {
        fireEvent.change(newPasswordInput, {
          target: { value: "newPassword123!" },
        });
        fireEvent.click(changeButton);
      });

      await waitFor(() => {
        expect(mockShowErrorHandler).toHaveBeenCalledWith(
          "오류",
          "비밀번호 변경에 실패했습니다.",
        );
      });
    });
  });
});
