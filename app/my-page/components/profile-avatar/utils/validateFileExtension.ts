import { ALLOWED_EXTENSIONS } from "app/my-page/components/profile-avatar/utils/allowedExtensions";

// 파일 확장자 검증
export const validateFileExtension = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return ALLOWED_EXTENSIONS.includes(extension);
};
