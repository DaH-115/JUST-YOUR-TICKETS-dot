"use client";

import { useState, useRef, useEffect } from "react";

export default function AnimatedOverview({ overview }: { overview: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("");
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = contentRef.current.clientHeight;
      setMaxHeight(`${scrollHeight}px`);
      setNeedsExpansion(scrollHeight > clientHeight);
    }
  }, [overview]);

  const toggleExpandHandler = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-b-4 border-dotted border-gray-200 p-4">
      <div className="relative">
        <div
          ref={contentRef}
          style={{ maxHeight: isExpanded ? maxHeight : "4rem" }}
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            !isExpanded && needsExpansion ? "mask-linear-gradient" : ""
          }`}
        >
          <p className="break-keep text-sm font-light">{overview}</p>
        </div>
        {!isExpanded && needsExpansion && (
          <span className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {needsExpansion && (
        <div className="flex justify-end">
          <button
            onClick={toggleExpandHandler}
            className="mt-2 rounded-lg p-1 text-xs text-gray-600 transition-all duration-200 hover:bg-primary-600 hover:text-white"
          >
            {isExpanded ? "접기" : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
