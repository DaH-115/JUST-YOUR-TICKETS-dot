import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AvatarUploader from "app/my-page/components/profile-avatar/AvatarUploader";

// Mock constants
jest.mock("app/constants/fileUpload", () => ({
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_CONTENT_TYPES: ["image/jpeg", "image/png", "image/gif"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
  formatFileSize: jest.fn((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }),
  validateFileExtension: jest.fn((filename: string) => {
    const extension = filename
      .toLowerCase()
      .substring(filename.lastIndexOf("."));
    return [".jpg", ".jpeg", ".png", ".gif"].includes(extension);
  }),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();

describe("AvatarUploader", () => {
  const mockOnPreview = jest.fn();
  const mockOnCancelPreview = jest.fn();
  const mockOnFileSelect = jest.fn();
  const mockOnImageChange = jest.fn();
  const mockOnError = jest.fn();

  const defaultProps = {
    previewSrc: null,
    onPreview: mockOnPreview,
    onCancelPreview: mockOnCancelPreview,
    onFileSelect: mockOnFileSelect,
    onImageChange: mockOnImageChange,
    onError: mockOnError,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("초기 상태", () => {
    it("프로필 이미지 수정 버튼이 렌더링된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      expect(screen.getByText("프로필 이미지 수정")).toBeInTheDocument();
      expect(screen.queryByText("이미지 선택")).not.toBeInTheDocument();
      expect(screen.queryByText("취소")).not.toBeInTheDocument();
    });

    it("파일 입력 필드가 숨겨져 있다", () => {
      render(<AvatarUploader {...defaultProps} />);

      // 편집 모드로 전환
      const editButton = screen.getByText("프로필 이미지 수정");
      fireEvent.click(editButton);

      const fileInput = screen.getByTestId("avatar-file-input");
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveClass("hidden");
    });
  });

  describe("편집 모드 토글", () => {
    it("프로필 이미지 수정 버튼 클릭 시 편집 모드로 전환된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      const editButton = screen.getByText("프로필 이미지 수정");
      fireEvent.click(editButton);

      expect(screen.getByText("이미지 선택")).toBeInTheDocument();
      expect(screen.getByText("취소")).toBeInTheDocument();
      expect(screen.queryByText("프로필 이미지 수정")).not.toBeInTheDocument();
    });

    it("편집 모드에서 파일 제한 안내가 표시된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      fireEvent.click(screen.getByText("프로필 이미지 수정"));

      expect(
        screen.getByText("• 지원 형식: JPG, PNG, GIF"),
      ).toBeInTheDocument();
      expect(screen.getByText("• 최대 크기: 5 MB")).toBeInTheDocument();
    });

    it("취소 버튼 클릭 시 편집 모드가 해제된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      fireEvent.click(screen.getByText("프로필 이미지 수정"));
      fireEvent.click(screen.getByText("취소"));

      expect(screen.getByText("프로필 이미지 수정")).toBeInTheDocument();
      expect(screen.queryByText("이미지 선택")).not.toBeInTheDocument();
      expect(screen.queryByText("취소")).not.toBeInTheDocument();
    });

    it("취소 시 관련 콜백 함수들이 호출된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      fireEvent.click(screen.getByText("프로필 이미지 수정"));
      fireEvent.click(screen.getByText("취소"));

      expect(mockOnCancelPreview).toHaveBeenCalledTimes(1);
      expect(mockOnFileSelect).toHaveBeenCalledWith(null);
      expect(mockOnImageChange).toHaveBeenCalledWith(false);
    });
  });

  describe("파일 선택", () => {
    beforeEach(() => {
      render(<AvatarUploader {...defaultProps} />);
      fireEvent.click(screen.getByText("프로필 이미지 수정"));
    });

    it("이미지 선택 버튼 클릭 시 파일 선택 대화상자가 열린다", () => {
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      const clickSpy = jest.spyOn(fileInput, "click");

      fireEvent.click(screen.getByText("이미지 선택"));

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("유효한 이미지 파일 선택 시 성공적으로 처리된다", () => {
      const validFile = new File(["image content"], "test.jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [validFile] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
      expect(mockOnPreview).toHaveBeenCalledWith("mocked-object-url");
      expect(mockOnImageChange).toHaveBeenCalledWith(true);
    });

    it("파일이 선택되지 않은 경우 적절히 처리된다", () => {
      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [] } });

      expect(mockOnFileSelect).toHaveBeenCalledWith(null);
      expect(mockOnCancelPreview).toHaveBeenCalledTimes(1);
      expect(mockOnImageChange).toHaveBeenCalledWith(false);
    });
  });

  describe("파일 유효성 검사", () => {
    beforeEach(() => {
      render(<AvatarUploader {...defaultProps} />);
      fireEvent.click(screen.getByText("프로필 이미지 수정"));
    });

    it("지원하지 않는 파일 확장자일 때 에러가 발생한다", () => {
      const invalidFile = new File(["content"], "test.txt", {
        type: "text/plain",
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(mockOnError).toHaveBeenCalledWith(
        "지원하지 않는 파일 형식입니다. (.jpg, .jpeg, .png, .gif 파일만 업로드 가능)",
      );
    });

    it("지원하지 않는 MIME 타입일 때 에러가 발생한다", () => {
      const invalidFile = new File(["content"], "test.jpg", {
        type: "text/plain",
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(mockOnError).toHaveBeenCalledWith(
        "지원하지 않는 파일 형식입니다. (JPG, PNG, GIF 파일만 업로드 가능)",
      );
    });

    it("파일 크기가 초과될 때 에러가 발생한다", () => {
      const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(mockOnError).toHaveBeenCalledWith(
        expect.stringContaining("파일 크기가 너무 큽니다."),
      );
    });

    it("에러 발생 시 파일 입력 필드가 초기화된다", () => {
      const invalidFile = new File(["content"], "test.txt", {
        type: "text/plain",
      });

      const fileInput = document.querySelector(
        'input[type="file"]',
      ) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(fileInput.value).toBe("");
    });
  });

  describe("파일 입력 속성", () => {
    it("파일 입력 필드에 올바른 accept 속성이 설정된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      // 편집 모드로 전환
      const editButton = screen.getByText("프로필 이미지 수정");
      fireEvent.click(editButton);

      const fileInput = screen.getByTestId("avatar-file-input");
      expect(fileInput).toHaveAttribute("accept", ".jpg,.jpeg,.png,.gif");
    });

    it("파일 입력 필드가 단일 파일만 선택 가능하다", () => {
      render(<AvatarUploader {...defaultProps} />);

      // 편집 모드로 전환
      const editButton = screen.getByText("프로필 이미지 수정");
      fireEvent.click(editButton);

      const fileInput = screen.getByTestId("avatar-file-input");
      expect(fileInput).not.toHaveAttribute("multiple");
    });
  });

  describe("버튼 스타일", () => {
    it("프로필 이미지 수정 버튼에 올바른 스타일이 적용된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      const editButton = screen.getByText("프로필 이미지 수정");
      expect(editButton).toHaveClass("rounded-xl");
      expect(editButton).toHaveClass("bg-gray-800");
      expect(editButton).toHaveClass("px-3");
      expect(editButton).toHaveClass("py-2");
      expect(editButton).toHaveClass("text-white");
    });

    it("이미지 선택 버튼에 올바른 스타일이 적용된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      fireEvent.click(screen.getByText("프로필 이미지 수정"));

      const selectButton = screen.getByText("이미지 선택");
      expect(selectButton).toHaveClass("rounded-xl");
      expect(selectButton).toHaveClass("bg-gray-200");
      expect(selectButton).toHaveClass("px-3");
      expect(selectButton).toHaveClass("py-2");
    });

    it("취소 버튼에 올바른 스타일이 적용된다", () => {
      render(<AvatarUploader {...defaultProps} />);

      fireEvent.click(screen.getByText("프로필 이미지 수정"));

      const cancelButton = screen.getByText("취소");
      expect(cancelButton).toHaveClass("rounded-xl");
      expect(cancelButton).toHaveClass("border");
      expect(cancelButton).toHaveClass("border-black");
      expect(cancelButton).toHaveClass("px-3");
      expect(cancelButton).toHaveClass("py-2");
    });
  });
});
