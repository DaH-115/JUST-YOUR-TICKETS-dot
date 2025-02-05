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
      className="flex items-center justify-center rounded-full border-2 border-green-200 bg-white p-2 text-primary-500 shadow-md"
      aria-label={`${ariaLabel} 부분으로 스크롤`}
    >
      {children}
    </button>
  );
}
