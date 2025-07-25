// 파일 크기 검증
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const validateFileSize = (size: number): boolean => {
  return size <= MAX_FILE_SIZE;
};
