import { useCallback } from "react";

interface ScrollButtonProps {
  targetId: string;
  airaLabel: string;
  children: React.ReactNode;
}

export default function ScrollButton({
  targetId,
  airaLabel,
  children,
}: ScrollButtonProps) {
  const clickHandler = useCallback(() => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [targetId]);

  return (
    <button
      onClick={clickHandler}
      className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-md transition-colors duration-300 hover:bg-white hover:text-[#121212] hover:shadow-lg"
      aria-label={`${airaLabel} 부분으로 스크롤`}
    >
      <span className="sr-only">{`${airaLabel} 부분으로 스크롤`}</span>
      {children}
    </button>
  );
}
