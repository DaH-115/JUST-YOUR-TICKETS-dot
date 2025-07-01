interface DuplicateCheckButtonProps {
  onClick: () => void;
  disabled: boolean;
  isChecking: boolean;
  className?: string;
}

export default function DuplicateCheckButton({
  onClick,
  disabled,
  isChecking,
  className = "",
}: DuplicateCheckButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-2 flex-shrink-0 rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
        disabled
          ? "cursor-not-allowed bg-gray-200 text-gray-400"
          : "bg-gray-600 text-white hover:bg-gray-700"
      } ${className}`}
    >
      {isChecking ? "확인중" : "중복확인"}
    </button>
  );
}
