import { useMemo } from "react";
import { getActivityLevel, ActivityLevel } from "lib/utils/getActivityLevel";

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
      // 문자열 레벨을 ActivityLevel 객체로 변환
      switch (activityLevel) {
        case "EXPERT":
          return {
            label: "EXPERT",
            badgeColor: "bg-purple-100 text-purple-700",
            bgGradient: "from-purple-50 to-purple-100",
          };
        case "ACTIVE":
          return {
            label: "ACTIVE",
            badgeColor: "bg-blue-100 text-blue-700",
            bgGradient: "from-blue-50 to-blue-100",
          };
        case "REGULAR":
          return {
            label: "REGULAR",
            badgeColor: "bg-green-100 text-green-700",
            bgGradient: "from-green-50 to-green-100",
          };
        case "NEWBIE":
        default:
          return {
            label: "NEWBIE",
            badgeColor: "bg-yellow-100 text-yellow-700",
            bgGradient: "from-yellow-50 to-yellow-100",
          };
      }
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
