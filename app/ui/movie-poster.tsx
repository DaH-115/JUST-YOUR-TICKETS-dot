import Image from "next/image";
import { useMemo } from "react";
import { getBlurDataUrl } from "../utils/image-utils";

interface MoviePosterProps {
  posterPath: string;
  title: string;
  className?: string;
}

export default function MoviePoster({
  posterPath,
  title,
  className = "",
}: MoviePosterProps) {
  const imageProps = useMemo(() => {
    const imageUrl = `https://image.tmdb.org/t/p/w500/${posterPath}`;

    return {
      src: imageUrl,
      width: 500,
      height: 750,
      quality: 75,
      sizes: "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 500px",
    };
  }, [posterPath]);

  return (
    <div
      className={`group relative aspect-[2/3] w-full overflow-hidden rounded-xl ${className}`}
    >
      <Image
        {...imageProps}
        alt={title}
        priority
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${getBlurDataUrl()}`}
        className="absolute h-full w-full transform object-cover transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:rounded-none"
      />
    </div>
  );
}
