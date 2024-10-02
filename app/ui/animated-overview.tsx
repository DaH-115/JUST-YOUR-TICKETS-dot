import { useState, useRef, useEffect } from "react";

export default function AnimatedOverview({ overview }: { overview: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, [overview]);

  const toggleExpandHandler = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border-b border-black px-4 py-6 text-lg">
      <div
        ref={contentRef}
        style={{ maxHeight: isExpanded ? maxHeight : "3.5rem" }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <p>{overview}</p>
      </div>

      {overview.split(" ").length > 30 && (
        <div className="flex justify-end">
          <button
            onClick={toggleExpandHandler}
            className="mt-2 rounded-lg border-2 border-gray-300 p-1 text-xs text-gray-500 transition-all duration-200 hover:border-black hover:bg-black hover:text-white focus:outline-none"
          >
            {isExpanded ? "접기" : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
