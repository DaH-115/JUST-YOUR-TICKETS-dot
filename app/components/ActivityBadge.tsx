import { useEffect, useState } from "react";
import {
  getActivityLevel,
  getLoadingActivityLevel,
  ActivityLevel,
} from "lib/utils/getActivityLevel";
import { fetchUserReviewCount } from "lib/users/fetchUserReviewCount";

interface ActivityBadgeProps {
  uid: string;
  size?: "tiny" | "small" | "medium";
  className?: string;
}

export default function ActivityBadge({
  uid,
  size = "tiny",
  className = "",
}: ActivityBadgeProps) {
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    getLoadingActivityLevel(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setActivityLevel(getActivityLevel(0));
      setIsLoading(false);
      return;
    }

    const loadUserLevel = async () => {
      try {
        const reviewCount = await fetchUserReviewCount(uid);
        setActivityLevel(getActivityLevel(reviewCount));
      } catch (error) {
        console.error("등급 로딩 실패:", error);
        setActivityLevel(getActivityLevel(0));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserLevel();
  }, [uid]);

  const sizeClasses = {
    tiny: "p-1 text-[10px] leading-none",
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
  };

  const getBadgeStyles = () => {
    const baseClasses = `inline-flex items-center justify-center rounded-full font-medium ${sizeClasses[size]} ${className}`;

    switch (activityLevel.label) {
      case "EXPERT":
        return `${baseClasses} bg-purple-100 text-purple-700`;
      case "ACTIVE":
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case "REGULAR":
        return `${baseClasses} bg-green-100 text-green-700`;
      case "NEWBIE":
        return `${baseClasses} bg-yellow-100 text-yellow-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-600`;
    }
  };

  return (
    <div className={getBadgeStyles()}>
      {isLoading ? "..." : activityLevel.label}
    </div>
  );
}
