"use client";

import { useState, useRef, useLayoutEffect } from "react";

interface AnimatedOverviewProps {
  overview: string;
  maxLines?: number;
  className?: string;
}

export default function AnimatedOverview({
  overview,
  maxLines = 3,
  className = "",
}: AnimatedOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // 실제 높이를 정확히 측정하기 위한 useLayoutEffect
  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const element = contentRef.current;

    // requestAnimationFrame으로 DOM 측정 최적화
    const measureHeight = () => {
      // 임시로 높이 제한 해제
      const originalHeight = element.style.height;
      const originalMaxHeight = element.style.maxHeight;

      element.style.height = "auto";
      element.style.maxHeight = "none";

      // 실제 높이 측정 (한 번에 처리)
      const fullHeight = element.scrollHeight;

      // 원래 높이 복원
      element.style.height = originalHeight;
      element.style.maxHeight = originalMaxHeight;

      // 상태 업데이트를 배치로 처리
      requestAnimationFrame(() => {
        setContentHeight(fullHeight);

        // 3줄 높이와 비교하여 버튼 표시 여부 결정
        const lineHeight = 24; // 대략적인 line-height
        const maxHeight = lineHeight * maxLines;
        setShowButton(fullHeight > maxHeight);
      });
    };

    // DOM 측정을 다음 프레임으로 지연
    requestAnimationFrame(measureHeight);
  }, [overview, maxLines]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!overview?.trim()) {
    return null;
  }

  const collapsedHeight = `${maxLines * 1.5}rem`; // 3줄 = 4.5rem

  return (
    <div className={`border-b-4 border-dotted p-4 ${className}`}>
      {/* 실제 표시되는 콘텐츠 */}
      <div className="relative">
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-500 ease-out"
          style={{
            height: isExpanded ? `${contentHeight}px` : collapsedHeight,
          }}
        >
          <p className="break-keep font-light leading-relaxed">{overview}</p>
        </div>

        {/* 그라데이션 오버레이 */}
        {!isExpanded && showButton && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {/* 더 보기/접기 버튼 */}
      {showButton && (
        <div className="flex justify-end">
          <button
            onClick={toggleExpanded}
            className="mt-2 rounded-lg px-3 py-1 text-xs text-gray-600 transition-all duration-200 hover:bg-primary-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "줄거리 접기" : "줄거리 더 보기"}
          >
            {isExpanded ? "접기" : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
