// 파일 타입(MIME) 검증
export const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const validateFileType = (fileType: string): boolean => {
  return ALLOWED_CONTENT_TYPES.includes(fileType);
};
