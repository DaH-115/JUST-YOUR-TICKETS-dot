export default function generateNickname(): string {
  // 1) 타임스탬프로 기본 닉네임 생성
  const timestamp = Date.now().toString().slice(-8);
  const base = `user${timestamp}`;

  // 2) 랜덤 3글자 덧붙이기
  const suffix = Math.random().toString(36).substring(2, 5);
  return `${base}_${suffix}`;
}
