export interface ActivityLevel {
  label: string;
  badgeColor: string;
  bgGradient: string;
}

export function getActivityLevel(reviewCount: number): ActivityLevel {
  if (reviewCount >= 50) {
    return {
      label: "EXPERT",
      badgeColor: "bg-purple-100 text-purple-700",
      bgGradient: "from-purple-50 to-purple-100",
    };
  }
  if (reviewCount >= 20) {
    return {
      label: "ACTIVE",
      badgeColor: "bg-blue-100 text-blue-700",
      bgGradient: "from-blue-50 to-blue-100",
    };
  }
  if (reviewCount >= 5) {
    return {
      label: "REGULAR",
      badgeColor: "bg-green-100 text-green-700",
      bgGradient: "from-green-50 to-green-100",
    };
  }
  return {
    label: "NEWBIE",
    badgeColor: "bg-yellow-100 text-yellow-700",
    bgGradient: "from-yellow-50 to-yellow-100",
  };
}

// 로딩 상태일 때의 기본 등급을 반환합니다.
export function getLoadingActivityLevel(): ActivityLevel {
  return {
    label: "...",
    badgeColor: "bg-gray-100 text-gray-600",
    bgGradient: "from-gray-50 to-gray-100",
  };
}
