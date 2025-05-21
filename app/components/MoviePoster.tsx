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
  lazy = false,
}: MoviePosterProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w${size}/${posterPath}`}
          alt={title}
          fill
          quality={80}
          priority={!lazy}
          loading={lazy ? "lazy" : "eager"}
          className="object-cover"
          sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${size}px`}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPYe0YQ1AAAAABJRU5ErkJggg=="
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-primary-700 p-4 text-white">
          <span className="text-sm">
            {title || "Make a ticket for your own movie review."}
          </span>
        </div>
      )}
    </div>
  );
}
