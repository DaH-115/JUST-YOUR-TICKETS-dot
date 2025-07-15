// 파일 업로드 제한 상수
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];

// 파일 크기를 읽기 쉬운 형태로 변환
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 파일 확장자 검증
export const validateFileExtension = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return ALLOWED_EXTENSIONS.includes(extension);
};
