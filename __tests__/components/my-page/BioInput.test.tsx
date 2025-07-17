import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import BioInput from "app/my-page/components/BioInput";

const mockSchema = z.object({
  biography: z
    .string()
    .max(100, "바이오는 100자를 초과할 수 없습니다")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof mockSchema>;

// 테스트용 래퍼 컴포넌트
const TestWrapper = ({
  children,
  defaultValues = { biography: "" },
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

describe("BioInput", () => {
  describe("편집 모드", () => {
    it("편집 모드에서 텍스트 영역이 렌더링된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      expect(screen.getByLabelText("소개")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("자신을 소개해보세요"),
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("바이오 입력 시 값이 변경된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      fireEvent.change(textarea, { target: { value: "새로운 바이오입니다." } });

      expect(textarea).toHaveValue("새로운 바이오입니다.");
    });

    it("텍스트 영역이 3행으로 설정되어 있다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      expect(textarea).toHaveAttribute("rows", "3");
    });

    it("리사이즈가 비활성화되어 있다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      expect(textarea).toHaveClass("resize-none");
    });

    it("100자를 초과할 때 에러 메시지가 표시된다", async () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      const longBio = "a".repeat(101);
      fireEvent.change(textarea, { target: { value: longBio } });
      fireEvent.blur(textarea);

      await waitFor(() => {
        expect(
          screen.getByText("바이오는 100자를 초과할 수 없습니다"),
        ).toBeInTheDocument();
      });
    });

    it("에러 메시지가 빨간색으로 표시된다", async () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      const longBio = "a".repeat(101);
      fireEvent.change(textarea, { target: { value: longBio } });
      fireEvent.blur(textarea);

      await waitFor(() => {
        const errorMessage = screen.getByText(
          "바이오는 100자를 초과할 수 없습니다",
        );
        expect(errorMessage).toHaveClass("text-red-500");
      });
    });

    it("유효한 바이오 입력 시 에러 메시지가 표시되지 않는다", async () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      fireEvent.change(textarea, { target: { value: "유효한 바이오입니다." } });
      fireEvent.blur(textarea);

      await waitFor(() => {
        expect(
          screen.queryByText("바이오는 100자를 초과할 수 없습니다"),
        ).not.toBeInTheDocument();
      });
    });

    it("빈 문자열 입력이 허용된다", async () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      fireEvent.change(textarea, { target: { value: "" } });
      fireEvent.blur(textarea);

      await waitFor(() => {
        expect(
          screen.queryByText("바이오는 100자를 초과할 수 없습니다"),
        ).not.toBeInTheDocument();
      });
    });

    it("정확히 100자일 때 에러가 발생하지 않는다", async () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      const exactBio = "a".repeat(100);
      fireEvent.change(textarea, { target: { value: exactBio } });
      fireEvent.blur(textarea);

      await waitFor(() => {
        expect(
          screen.queryByText("바이오는 100자를 초과할 수 없습니다"),
        ).not.toBeInTheDocument();
      });
    });

    it("포커스 스타일이 올바르게 적용된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const textarea = screen.getByLabelText("소개");
      expect(textarea).toHaveClass("focus:border-accent-500");
      expect(textarea).toHaveClass("focus:ring-accent-300");
    });
  });

  describe("읽기 전용 모드", () => {
    it("읽기 전용 모드에서 바이오 값이 표시된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="표시될 바이오입니다." isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("표시될 바이오입니다.")).toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("바이오가 없을 때 '바이오 없음'이 표시된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue={null} isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("바이오 없음")).toBeInTheDocument();
    });

    it("빈 문자열일 때 '바이오 없음'이 표시된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="" isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("바이오 없음")).toBeInTheDocument();
    });

    it("읽기 전용 모드에서 라벨이 표시된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="바이오 내용" isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("소개")).toBeInTheDocument();
    });

    it("읽기 전용 모드에서 올바른 스타일이 적용된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="바이오 내용" isEditing={false} />
        </TestWrapper>,
      );

      const bioText = screen.getByText("바이오 내용");
      expect(bioText).toHaveClass("border-b");
      expect(bioText).toHaveClass("border-gray-500");
      expect(bioText).toHaveClass("py-2");
      expect(bioText).toHaveClass("text-gray-800");
    });
  });

  describe("라벨 및 접근성", () => {
    it("라벨이 입력 필드와 올바르게 연결되어 있다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const label = screen.getByText("소개");
      const textarea = screen.getByLabelText("소개");

      expect(label).toHaveAttribute("for", "biography");
      expect(textarea).toHaveAttribute("id", "biography");
    });

    it("라벨에 올바른 스타일이 적용되어 있다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue="기존 바이오" isEditing={true} />
        </TestWrapper>,
      );

      const label = screen.getByText("소개");
      expect(label).toHaveClass("mb-2");
      expect(label).toHaveClass("block");
      expect(label).toHaveClass("text-sm");
      expect(label).toHaveClass("font-medium");
      expect(label).toHaveClass("text-gray-700");
    });
  });

  describe("기본값 처리", () => {
    it("originalValue가 undefined일 때 올바르게 처리된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue={undefined} isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("바이오 없음")).toBeInTheDocument();
    });

    it("originalValue가 null일 때 올바르게 처리된다", () => {
      render(
        <TestWrapper>
          <BioInput originalValue={null} isEditing={false} />
        </TestWrapper>,
      );

      expect(screen.getByText("바이오 없음")).toBeInTheDocument();
    });
  });
});
