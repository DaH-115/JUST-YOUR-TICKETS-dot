interface MovieRatingProps {
  certification: string | null;
  showLabel?: boolean;
}

const ratingColors: Record<string, string> = {
  ALL: "bg-green-500",
  "12": "bg-yellow-500",
  "15": "bg-orange-500",
  "18": "bg-red-500",
  RESTRICTED: "bg-red-600",
  default: "bg-gray-500",
};

const ratingLabels: Record<string, string> = {
  ALL: "전체관람가",
  "12": "12세관람가",
  "15": "15세관람가",
  "18": "18세관람가",
  RESTRICTED: "제한관람가",
};

export default function MovieRating({
  certification,
  showLabel = false,
}: MovieRatingProps) {
  if (!certification) {
    return null;
  }

  const colorClass = ratingColors[certification] || ratingColors.default;
  const label = ratingLabels[certification];

  return (
    <div className="flex items-center gap-2">
      <div
        className={` ${colorClass} flex h-6 w-6 min-w-[1.5em] items-center justify-center rounded-full font-bold text-white ${certification === "ALL" ? "text-[10px]" : "text-xs"} `}
      >
        {certification}
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
    </div>
  );
}
