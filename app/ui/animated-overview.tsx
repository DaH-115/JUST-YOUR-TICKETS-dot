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
    <div className="border-b border-black px-4 py-6 text-lg">
      <div className="relative">
        <div
          ref={contentRef}
          style={{ maxHeight: isExpanded ? maxHeight : "4rem" }}
          className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            !isExpanded && needsExpansion ? "mask-linear-gradient" : ""
          }`}
        >
          <p>{overview}</p>
        </div>
        {!isExpanded && needsExpansion && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"></div>
        )}
      </div>

      {needsExpansion && (
        <div className="flex justify-end">
          <button
            onClick={toggleExpandHandler}
            className="mt-2 rounded-lg p-1 text-xs font-bold text-gray-400 transition-all duration-200 hover:border-black hover:bg-black hover:text-white focus:outline-none"
          >
            {isExpanded ? "접기" : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
