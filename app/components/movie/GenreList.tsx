export default function GenreList({ genres }: { genres: string[] }) {
  if (!genres || genres.length === 0) {
    return (
      <span className="px-2 py-1 text-xs text-gray-400">
        장르 정보가 없습니다
      </span>
    );
  }

  return (
    <ul className="flex w-full items-center gap-1 overflow-x-scroll py-2 scrollbar-hide">
      {genres.map((genre: string, idx: number) => (
        <li key={idx}>
          <p className="text-nowrap rounded-full border border-primary-500 bg-white px-2 py-1.5 text-xs text-black transition-colors duration-300 hover:bg-primary-400 hover:text-white">
            {genre}
          </p>
        </li>
      ))}
    </ul>
  );
}
