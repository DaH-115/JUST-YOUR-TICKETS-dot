import Image from "next/image";

interface MoviePosterProps {
  posterPath: string | null; // null인 경우 추가
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
    <div className="aspect-[2/3] h-full w-full">
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w${size}/${posterPath}`}
          alt={title}
          width={500}
          height={750}
          sizes="(max-width: 640px) 342px, (max-width: 768px) 500px, 100vw"
          quality={70}
          priority={lazy ? false : true}
          loading={lazy ? "lazy" : "eager"}
          className="rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#551226] p-4 text-center text-white">
          <span className="text-sm">
            {title || "Make a ticket for your own movie review."}
          </span>
        </div>
      )}
    </div>
  );
}
