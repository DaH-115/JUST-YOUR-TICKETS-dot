import Image from "next/image";

interface MoviePosterProps {
  posterPath?: string;
  title: string;
  size: 500 | 342;
  lazy?: boolean;
}

export default function MoviePoster({
  posterPath,
  title,
  size,
  lazy,
}: MoviePosterProps) {
  return (
    <div className="relative aspect-[2/3]">
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w${size}/${posterPath}`}
          alt={title}
          width={size}
          height={size * 1.5}
          quality={85}
          priority={!lazy}
          loading={lazy ? "lazy" : "eager"}
          className="h-full w-full rounded-lg object-cover"
        />
      ) : (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-primary-700 p-4 text-center text-white">
          <span className="text-sm">
            {title || "Make a ticket for your own movie review."}
          </span>
        </div>
      )}
    </div>
  );
}
