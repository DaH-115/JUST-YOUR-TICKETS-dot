import { useCallback } from "react";

interface ScrollButtonProps {
  targetId: string;
  ariaLabel: string;
  children: React.ReactNode;
}

export default function ScrollButton({
  targetId,
  ariaLabel,
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
      aria-label={`${ariaLabel} 부분으로 스크롤`}
    >
      {children}
    </button>
  );
}
