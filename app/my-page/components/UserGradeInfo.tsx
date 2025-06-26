"use client";

import { useState } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { ActivityLevel } from "lib/utils/getActivityLevel";

interface UserGradeInfoProps {
  currentLevel: ActivityLevel;
  currentReviewCount: number;
}

const gradeInfo = [
  {
    label: "NEWBIE",
    color: "bg-yellow-100 text-yellow-700",
    bgGradient: "from-yellow-50 to-yellow-100",
    range: "0-4개",
    minThreshold: 0,
    description: "영화 리뷰를 시작한 신입 리뷰어입니다.",
    nextGoal: "5개의 리뷰를 작성하면 REGULAR 등급으로 승급됩니다!",
  },
  {
    label: "REGULAR",
    color: "bg-green-100 text-green-700",
    bgGradient: "from-green-50 to-green-100",
    range: "5-19개",
    minThreshold: 5,
    description: "꾸준히 리뷰를 작성하는 일반 리뷰어입니다.",
    nextGoal: "20개의 리뷰를 작성하면 ACTIVE 등급으로 승급됩니다!",
  },
  {
    label: "ACTIVE",
    color: "bg-blue-100 text-blue-700",
    bgGradient: "from-blue-50 to-blue-100",
    range: "20-49개",
    minThreshold: 20,
    description: "활발하게 리뷰 활동을 하는 액티브 리뷰어입니다.",
    nextGoal: "50개의 리뷰를 작성하면 EXPERT 등급으로 승급됩니다!",
  },
  {
    label: "EXPERT",
    color: "bg-purple-100 text-purple-700",
    bgGradient: "from-purple-50 to-purple-100",
    range: "50개+",
    minThreshold: 50,
    description: "최고 등급의 전문 리뷰어입니다. 축하합니다!",
    nextGoal: "최고 등급에 도달했습니다! 계속해서 훌륭한 리뷰를 작성해주세요.",
  },
];

export default function UserGradeInfo({
  currentLevel,
  currentReviewCount,
}: UserGradeInfoProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCurrentGradeInfo = () => {
    return gradeInfo.find((info) => info.label === currentLevel.label);
  };

  const getNextGradeInfo = () => {
    const currentIndex = gradeInfo.findIndex(
      (info) => info.label === currentLevel.label,
    );
    return currentIndex < gradeInfo.length - 1
      ? gradeInfo[currentIndex + 1]
      : null;
  };

  const getProgressToNext = () => {
    const currentGrade = getCurrentGradeInfo();
    const nextGrade = getNextGradeInfo();

    if (!nextGrade || !currentGrade) return 100;

    const currentThreshold = currentGrade.minThreshold;
    const nextThreshold = nextGrade.minThreshold;

    const progress =
      ((currentReviewCount - currentThreshold) /
        (nextThreshold - currentThreshold)) *
      100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const currentGradeInfo = getCurrentGradeInfo();
  const nextGradeInfo = getNextGradeInfo();
  const progressPercentage = getProgressToNext();

  return (
    <>
      {/* 등급 정보 버튼 */}
      <div className="flex items-center gap-2">
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${currentLevel.badgeColor}`}
        >
          {currentLevel.label}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="등급 정보 보기"
        >
          <FaInfoCircle size={12} />
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between border-b bg-white p-4">
              <h2 className="text-lg font-bold text-gray-800">
                유저 등급 시스템
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 transition-colors hover:text-gray-600"
                aria-label="모달 닫기"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* 스크롤 가능한 콘텐츠 영역 */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="p-4">
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-800">
                    현재 등급
                  </h3>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full px-3 py-1 text-sm font-medium ${currentLevel.badgeColor}`}
                    >
                      {currentLevel.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentReviewCount}개 리뷰 작성
                    </div>
                  </div>
                  {currentGradeInfo && (
                    <p className="mt-2 text-sm text-gray-700">
                      {currentGradeInfo.description}
                    </p>
                  )}
                </div>

                {/* 다음 등급까지의 진행률 */}
                {nextGradeInfo && (
                  <div className="mb-4 rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-800">
                      다음 등급까지
                    </h3>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {nextGradeInfo.label}까지
                      </span>
                      <span className="font-medium text-gray-800">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    {currentGradeInfo && (
                      <p className="text-xs text-gray-600">
                        {currentGradeInfo.nextGoal}
                      </p>
                    )}
                  </div>
                )}

                {/* 모든 등급 정보 */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-800">
                    등급별 상세 정보
                  </h3>
                  <div className="space-y-3">
                    {gradeInfo.map((grade) => (
                      <div
                        key={grade.label}
                        className={`rounded-lg border-2 p-3 ${
                          grade.label === currentLevel.label
                            ? "border-blue-200 bg-blue-50"
                            : "border-gray-100 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`rounded-full px-2 py-1 text-xs font-medium ${grade.color}`}
                            >
                              {grade.label}
                            </div>
                            <span className="text-xs text-gray-600">
                              {grade.range} 리뷰
                            </span>
                          </div>
                          {grade.label === currentLevel.label && (
                            <span className="text-xs font-medium text-blue-600">
                              현재 등급
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-700">
                          {grade.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
