// 1. jest.mock
jest.mock("app/utils/file/validateFileSize", () => ({
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  validateFileSize: jest.fn(() => true), // 함수도 mock
}));
jest.mock("app/utils/file/validateFileExtension", () => ({
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
  validateFileExtension: jest.fn(() => true), // 함수도 mock
}));
jest.mock("app/utils/file/formatFileSize", () => ({
  formatFileSize: jest.fn((bytes) =>
    bytes === 5 * 1024 * 1024 ? "5 MB" : `${bytes} bytes`,
  ),
}));

// 2. import 구문
import { render, screen, fireEvent } from "@testing-library/react";
import AvatarUploader from "app/my-page/components/profile-avatar/AvatarUploader";

// 3. 테스트 코드
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

  test("프로필 이미지 수정 버튼이 렌더링된다", () => {
    render(<AvatarUploader {...defaultProps} />);
    expect(screen.getByText("프로필 이미지 수정")).toBeInTheDocument();
  });

  test("편집 모드에서 파일 제한 안내가 표시된다", () => {
    render(<AvatarUploader {...defaultProps} />);
    fireEvent.click(screen.getByText("프로필 이미지 수정"));
    expect(screen.getByText("• 지원 형식: JPG, PNG, GIF")).toBeInTheDocument();
    expect(screen.getByText("• 최대 크기: 5 MB")).toBeInTheDocument();
  });

  test("유효한 이미지 파일 선택 시 성공적으로 처리된다", () => {
    render(<AvatarUploader {...defaultProps} />);
    fireEvent.click(screen.getByText("프로필 이미지 수정"));
    const validFile = new File(["image content"], "test.jpg", {
      type: "image/jpeg",
    });
    const fileInput = screen.getByTestId("avatar-file-input");
    fireEvent.change(fileInput, { target: { files: [validFile] } });
    expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
    expect(mockOnPreview).toHaveBeenCalledWith("mocked-object-url");
    expect(mockOnImageChange).toHaveBeenCalledWith(true);
  });

  test("파일이 선택되지 않은 경우 적절히 처리된다", () => {
    render(<AvatarUploader {...defaultProps} />);
    fireEvent.click(screen.getByText("프로필 이미지 수정"));
    const fileInput = screen.getByTestId("avatar-file-input");
    fireEvent.change(fileInput, { target: { files: [] } });
    expect(mockOnFileSelect).toHaveBeenCalledWith(null);
    expect(mockOnCancelPreview).toHaveBeenCalledTimes(1);
    expect(mockOnImageChange).toHaveBeenCalledWith(false);
  });

  test("파일 입력 필드에 올바른 accept 속성이 설정된다", () => {
    render(<AvatarUploader {...defaultProps} />);
    fireEvent.click(screen.getByText("프로필 이미지 수정"));
    const fileInput = screen.getByTestId("avatar-file-input");
    expect(fileInput).toHaveAttribute("accept", ".jpg,.jpeg,.png,.gif");
  });

  test("파일 입력 필드가 단일 파일만 선택 가능하다", () => {
    render(<AvatarUploader {...defaultProps} />);
    fireEvent.click(screen.getByText("프로필 이미지 수정"));
    const fileInput = screen.getByTestId("avatar-file-input");
    expect(fileInput).not.toHaveAttribute("multiple");
  });
});
