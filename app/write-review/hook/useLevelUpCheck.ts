import { useEffect, useState } from "react";

interface UseLevelUpCheckProps {
  prevLevel: string | null;
  currentLevel: string | null;
  levels: string[];
  reviewSubmitted: boolean;
}

export function useLevelUpCheck({
  prevLevel,
  currentLevel,
  levels,
  reviewSubmitted,
}: UseLevelUpCheckProps) {
  const [levelUpOpen, setLevelUpOpen] = useState(false);

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

  return [levelUpOpen, setLevelUpOpen] as const;
}
