interface GenreListProps {
  genres: string[];
  variant?: "default" | "small";
}

export default function GenreList({
  genres,
  variant = "default",
}: GenreListProps) {
  if (!genres || genres.length === 0) {
    return (
      <span className="px-2 py-1 text-xs text-gray-300">
        장르 정보가 없습니다
      </span>
    );
  }

  const getTagClassName = () => {
    const baseClasses =
      "text-nowrap rounded-full border bg-white  text-black transition-colors duration-300 hover:bg-primary-500 hover:text-white active:bg-black active:text-white";

    if (variant === "small") {
      return `${baseClasses} border-primary-500 px-2 py-1 text-[11px]`;
    }
    return `${baseClasses} border-black px-3 py-1.5 text-sm`;
  };

  return (
    <ul
      className={`${variant === "small" ? "py-2" : "py-3"} flex w-full items-center gap-1 overflow-x-scroll scrollbar-hide`}
    >
      {genres.map((genre: string, idx: number) => (
        <li key={idx}>
          <span className={getTagClassName()}>{genre}</span>
        </li>
      ))}
    </ul>
  );
}
