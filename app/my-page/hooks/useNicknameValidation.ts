export function useNicknameValidation() {
  const checkNicknameDuplicate = async (nickname: string) => {
    try {
      const response = await fetch("/api/auth/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "displayName",
          value: nickname,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "중복 확인에 실패했습니다.");
      }

      // available이 false면 중복(사용 불가)
      return !result.available;
    } catch (error) {
      console.error("닉네임 중복 검사 실패:", error);
      return true; // 에러 시 중복으로 처리하여 안전하게 처리
    }
  };

  return { checkNicknameDuplicate };
}
