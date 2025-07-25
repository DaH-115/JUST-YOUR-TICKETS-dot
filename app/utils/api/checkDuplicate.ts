// 중복 체크 API 호출 유틸
export async function checkDuplicate(
  type: "displayName" | "email",
  value: string,
): Promise<{ available: boolean; message: string }> {
  const response = await fetch("/api/auth/check-availability", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, value }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "중복 확인에 실패했습니다.");
  }
  return result;
}
