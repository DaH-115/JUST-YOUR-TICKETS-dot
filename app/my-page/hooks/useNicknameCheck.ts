"use client";

import { useState, useCallback, useEffect } from "react";

interface NicknameCheckOptions {
  // 중복 확인을 수행할 닉네임 값
  nickname: string;
  // 수정 모드일 경우, 기존 닉네임 값
  originalNickname?: string | null;
}

/**
 * 닉네임 중복 확인 로직을 처리하는 커스텀 훅.
 * API 요청, 로딩 상태, 결과 상태(사용 가능 여부, 메시지)를 모두 내부에서 관리합니다.
 * @param {NicknameCheckOptions} options - 닉네임과 원본 닉네임 값을 포함하는 객체
 * @returns {object} 중복 확인 관련 상태와 함수들
 */
export const useNicknameCheck = ({
  nickname,
  originalNickname,
}: NicknameCheckOptions) => {
  const [status, setStatus] = useState({
    isChecking: false, // API 요청 중인지 여부
    isChecked: false, // 중복 확인을 수행했는지 여부
    isAvailable: null as boolean | null, // 닉네임 사용 가능 여부
    message: null as string | null, // API 결과 메시지
  });

  // 닉네임 값이 변경될 때마다 확인 상태를 초기화
  useEffect(() => {
    setStatus({
      isChecking: false,
      isChecked: false,
      isAvailable: null,
      message: null,
    });
  }, [nickname]);

  /**
   * 중복 확인을 실행하는 함수.
   */
  const checkNickname = useCallback(async () => {
    // 닉네임이 비어있는 경우
    if (!nickname || nickname.trim() === "") {
      setStatus({
        isChecking: false,
        isChecked: true,
        isAvailable: false,
        message: "닉네임을 입력해주세요.",
      });
      return;
    }

    // 기존 닉네임과 동일한 경우 (수정 시)
    if (originalNickname && nickname === originalNickname) {
      setStatus({
        isChecking: false,
        isChecked: true,
        isAvailable: true,
        message: null, // 별도 메시지 없음
      });
      return;
    }

    // API 요청 시작
    setStatus((prev) => ({ ...prev, isChecking: true, message: null }));

    try {
      const response = await fetch("/api/auth/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "displayName", value: nickname }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "중복 확인에 실패했습니다.");
      }

      // API 요청 성공
      setStatus({
        isChecking: false,
        isChecked: true,
        isAvailable: result.available,
        message: result.message,
      });
    } catch (err: any) {
      // API 요청 실패
      setStatus({
        isChecking: false,
        isChecked: true,
        isAvailable: false,
        message: err.message || "중복 확인 중 오류가 발생했습니다.",
      });
    }
  }, [nickname, originalNickname]);

  return { ...status, checkNickname };
};
