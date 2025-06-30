import { useMemo } from "react";
import {
  getActivityLevel,
  getActivityLevelInfo,
  ActivityLevel,
} from "lib/utils/getActivityLevel";

interface ActivityBadgeProps {
  activityLevel?: string; // "NEWBIE", "REGULAR", "ACTIVE", "EXPERT"
  uid?: string; // 호환성을 위해 유지 (사용하지 않음)
  size?: "tiny" | "small" | "medium";
  className?: string;
}

export default function ActivityBadge({
  activityLevel,
  size = "tiny",
  className = "",
}: ActivityBadgeProps) {
  // activityLevel이 제공되면 해당 레벨 사용, 없으면 기본값(NEWBIE) 사용
  const computedActivityLevel = useMemo((): ActivityLevel => {
    if (activityLevel) {
      return getActivityLevelInfo(activityLevel);
    }
    // 기본값: NEWBIE
    return getActivityLevel(0);
  }, [activityLevel]);

  const sizeClasses = {
    tiny: "p-1 text-[10px] leading-none",
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
  };

  const getBadgeStyles = () => {
    const baseClasses = `inline-flex items-center justify-center rounded-full font-medium ${sizeClasses[size]} ${className}`;
    return `${baseClasses} ${computedActivityLevel.badgeColor}`;
  };

  return <div className={getBadgeStyles()}>{computedActivityLevel.label}</div>;
}
