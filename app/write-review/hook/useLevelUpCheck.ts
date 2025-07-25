// 리뷰 작성 후 등급 변화(레벨업) 감지 및 모달 트리거 커스텀 훅
// - 이전 등급과 현재 등급을 비교해 레벨업 시 모달을 띄우는 로직을 분리
// - UI 컴포넌트는 levelUpOpen, setLevelUpOpen만 사용하면 됨
import { useEffect, useState } from "react";

interface UseLevelUpCheckProps {
  prevLevel: string | null;
  currentLevel: string | null;
  levels: string[];
  reviewSubmitted: boolean;
}

/**
 * 리뷰 작성 후 등급 변화(레벨업) 감지 및 모달 트리거 커스텀 훅
 * - 이전 등급과 현재 등급을 비교해 레벨업 시 모달을 띄움
 * @param prevLevel - 리뷰 작성 전 등급
 * @param currentLevel - 리뷰 작성 후 등급
 * @param levels - 등급 단계 배열
 * @param reviewSubmitted - 리뷰 작성 완료 여부
 * @returns [levelUpOpen, setLevelUpOpen]
 */
export function useLevelUpCheck({
  prevLevel,
  currentLevel,
  levels,
  reviewSubmitted,
}: UseLevelUpCheckProps) {
  // 레벨업 모달 오픈 상태
  const [levelUpOpen, setLevelUpOpen] = useState(false);

  /**
   * 리뷰 작성 완료 후 등급 변화가 있고, 상위 등급으로 올라갔을 때 모달 오픈
   */
  useEffect(() => {
    if (!reviewSubmitted) return;
    if (!prevLevel || !currentLevel) return;
    if (
      prevLevel !== currentLevel &&
      levels.indexOf(currentLevel) > levels.indexOf(prevLevel)
    ) {
      setLevelUpOpen(true);
    }
  }, [prevLevel, currentLevel, levels, reviewSubmitted]);

  // UI에서 사용할 상태 반환
  return [levelUpOpen, setLevelUpOpen] as const;
}
