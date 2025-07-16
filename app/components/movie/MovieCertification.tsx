interface MovieCertificationProps {
  certification: string | null;
  className?: string;
  showLabel?: boolean;
}

const certificationColors: Record<string, string> = {
  ALL: "bg-green-500",
  "12": "bg-blue-500",
  "15": "bg-yellow-500",
  "18": "bg-red-500",
  default: "bg-gray-500",
};

const certificationLabels: Record<string, string> = {
  ALL: "전체",
  "12": "12",
  "15": "15",
  "18": "18",
};

export default function MovieCertification({
  certification,
  className,
  showLabel = true,
}: MovieCertificationProps) {
  if (!certification) {
    return null;
  }

  const colorClass =
    certificationColors[certification] || certificationColors.default;
  const label = certificationLabels[certification];

  if (!label) {
    return null;
  }

  return (
    <div
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${colorClass} ${
        className || ""
      }`}
    >
      {showLabel && label}
    </div>
  );
}
