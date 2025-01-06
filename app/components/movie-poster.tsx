import Image from "next/image";

interface MoviePosterProps {
  posterPath: string;
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
    </div>
  );
}
