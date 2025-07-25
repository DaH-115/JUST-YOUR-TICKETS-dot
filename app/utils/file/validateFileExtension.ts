// 파일 확장자 검증
export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif"];
export const validateFileExtension = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return ALLOWED_EXTENSIONS.includes(extension);
};
