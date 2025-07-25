import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import NicknameInput from "app/my-page/components/NicknameInput";
import { useDuplicateCheck } from "app/my-page/hooks/useDuplicateCheck";

// Mock modules
jest.mock("app/my-page/hooks/useDuplicateCheck");
jest.mock("app/components/ui/buttons/DuplicateCheckButton", () => {
  return function MockDuplicateCheckButton({
    onClick,
    disabled,
    isChecking,
    className,
  }: {
    onClick: () => void;
    disabled: boolean;
    isChecking: boolean;
    className?: string;
  }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={className}
        data-testid="duplicate-check-button"
      >
        {isChecking ? "확인 중..." : "중복 확인"}
      </button>
    );
  };
});

const mockSchema = z.object({
  displayName: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(20, "이름은 20자를 초과할 수 없습니다")
    .regex(/^[가-힣a-zA-Z0-9\s_]+$/, "이름에 특수문자를 사용할 수 없습니다"),
});

type FormData = z.infer<typeof mockSchema>;

// 테스트용 래퍼 컴포넌트
const TestWrapper = ({
  children,
  defaultValues = { displayName: "" },
}: {
  children: React.ReactNode;
  defaultValues?: Partial<FormData>;
}) => {
  const methods = useForm<FormData>({
    resolver: zodResolver(mockSchema),
    mode: "onChange",
    defaultValues,
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe("NicknameInput", () => {
  const mockCheckNickname = jest.fn();
  const mockUseDuplicateCheck = useDuplicateCheck as jest.MockedFunction<
    typeof useDuplicateCheck
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseDuplicateCheck.mockReturnValue({
      check: mockCheckNickname,
      isChecking: false,
      isChecked: false,
      isAvailable: null,
      message: null,
    });
  });

  describe("편집 모드", () => {
    test("편집 모드에서 입력 필드와 중복 확인 버튼이 렌더링된다", () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      expect(screen.getByLabelText("닉네임")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("닉네임을 입력하세요"),
      ).toBeInTheDocument();
      expect(screen.getByTestId("duplicate-check-button")).toBeInTheDocument();
    });

    test("닉네임 입력 시 값이 변경된다", () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const input = screen.getByLabelText("닉네임");
      fireEvent.change(input, { target: { value: "새닉네임" } });

      expect(input).toHaveValue("새닉네임");
    });

    test("중복 확인 버튼 클릭 시 checkNickname 함수가 호출된다", () => {
      render(
        <TestWrapper defaultValues={{ displayName: "새닉네임" }}>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const button = screen.getByTestId("duplicate-check-button");
      fireEvent.click(button);

      expect(mockCheckNickname).toHaveBeenCalledTimes(1);
    });

    test("중복 확인 중일 때 버튼이 비활성화된다", () => {
      mockUseDuplicateCheck.mockReturnValue({
        check: mockCheckNickname,
        isChecking: true,
        isChecked: false,
        isAvailable: null,
        message: null,
      });

      render(
        <TestWrapper>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const button = screen.getByTestId("duplicate-check-button");
      expect(button).toBeDisabled();
      expect(button).toHaveTextContent("확인 중...");
    });

    test("닉네임이 비어있을 때 중복 확인 버튼이 비활성화된다", () => {
      render(
        <TestWrapper defaultValues={{ displayName: "" }}>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const button = screen.getByTestId("duplicate-check-button");
      expect(button).toBeDisabled();
    });

    test("폼 유효성 검사 에러가 있을 때 중복 확인 버튼이 비활성화된다", async () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      // 유효하지 않은 닉네임을 입력
      const input = screen.getByLabelText("닉네임");
      fireEvent.change(input, { target: { value: "특수문자포함!" } });

      // 에러 메시지가 나타날 때까지 기다림
      await waitFor(() => {
        expect(
          screen.getByText("이름에 특수문자를 사용할 수 없습니다"),
        ).toBeInTheDocument();
      });

      // 그 후 버튼이 비활성화되어야 함
      const button = screen.getByTestId("duplicate-check-button");
      expect(button).toBeDisabled();
    });

    test("중복 확인 성공 시 성공 메시지가 표시된다", () => {
      mockUseDuplicateCheck.mockReturnValue({
        check: mockCheckNickname,
        isChecking: false,
        isChecked: true,
        isAvailable: true,
        message: "사용 가능한 닉네임입니다.",
      });

      render(
        <TestWrapper defaultValues={{ displayName: "새닉네임" }}>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      expect(screen.getByText("사용 가능한 닉네임입니다.")).toBeInTheDocument();
      expect(screen.getByText("사용 가능한 닉네임입니다.")).toHaveClass(
        "text-green-600",
      );
    });

    test("중복 확인 실패 시 에러 메시지가 표시된다", () => {
      mockUseDuplicateCheck.mockReturnValue({
        check: mockCheckNickname,
        isChecking: false,
        isChecked: true,
        isAvailable: false,
        message: "이미 사용 중인 닉네임입니다.",
      });

      render(
        <TestWrapper defaultValues={{ displayName: "중복닉네임" }}>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      expect(
        screen.getByText("이미 사용 중인 닉네임입니다."),
      ).toBeInTheDocument();
      expect(screen.getByText("이미 사용 중인 닉네임입니다.")).toHaveClass(
        "text-red-500",
      );
    });

    test("폼 유효성 검사 에러가 표시된다", async () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const input = screen.getByLabelText("닉네임");
      fireEvent.change(input, { target: { value: "특수문자포함!" } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(
          screen.getByText("이름에 특수문자를 사용할 수 없습니다"),
        ).toBeInTheDocument();
      });
    });

    test("닉네임이 20자를 초과할 때 에러 메시지가 표시된다", async () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const input = screen.getByLabelText("닉네임");
      const longNickname = "a".repeat(21);
      fireEvent.change(input, { target: { value: longNickname } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(
          screen.getByText("이름은 20자를 초과할 수 없습니다"),
        ).toBeInTheDocument();
      });
    });

    test("중복 확인 성공 후 다시 버튼이 비활성화된다", () => {
      mockUseDuplicateCheck.mockReturnValue({
        check: mockCheckNickname,
        isChecking: false,
        isChecked: true,
        isAvailable: true,
        message: "사용 가능한 닉네임입니다.",
      });

      render(
        <TestWrapper defaultValues={{ displayName: "새닉네임" }}>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      const button = screen.getByTestId("duplicate-check-button");
      expect(button).toBeDisabled();
    });
  });

  describe("읽기 전용 모드", () => {
    test("읽기 전용 모드에서 닉네임 값이 표시된다", () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="표시될닉네임" isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("표시될닉네임")).toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("duplicate-check-button"),
      ).not.toBeInTheDocument();
    });

    test("닉네임이 없을 때 '없음'이 표시된다", () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue={null} isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("없음")).toBeInTheDocument();
    });

    test("빈 문자열일 때 '없음'이 표시된다", () => {
      render(
        <TestWrapper>
          <NicknameInput originalValue="" isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("없음")).toBeInTheDocument();
    });
  });

  describe("닉네임 중복 확인 훅 연동", () => {
    test("useDuplicateCheck 훅에 올바른 파라미터가 전달된다", () => {
      render(
        <TestWrapper defaultValues={{ displayName: "테스트닉네임" }}>
          <NicknameInput originalValue="기존닉네임" isEditing={true} />
        </TestWrapper>,
      );

      expect(mockUseDuplicateCheck).toHaveBeenCalledWith({
        type: "displayName",
        value: "테스트닉네임",
        originalValue: "기존닉네임",
      });
    });

    test("원본 닉네임이 없을 때도 올바르게 처리된다", () => {
      render(
        <TestWrapper defaultValues={{ displayName: "테스트닉네임" }}>
          <NicknameInput originalValue={null} isEditing={true} />
        </TestWrapper>,
      );

      expect(mockUseDuplicateCheck).toHaveBeenCalledWith({
        type: "displayName",
        value: "테스트닉네임",
        originalValue: undefined,
      });
    });
  });
});
