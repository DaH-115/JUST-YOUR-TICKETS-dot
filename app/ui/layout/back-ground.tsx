import Image from "next/image";
import { useMemo } from "react";

interface BackGroundProps {
  imageUrl: string;
  movieTitle: string;
}

export default function BackGround({
  imageUrl,
  movieTitle = "Background Image",
}: BackGroundProps) {
  const imageProps = useMemo(() => {
    const baseUrl = `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${imageUrl}`;

    return {
      src: baseUrl,
      width: 1920,
      height: 800,
      quality: 70,
      sizes: "(min-width: 1536px) 1920px, 100vw",
      loading: "eager" as "eager",
      fetchPriority: "high" as "high",
    };
  }, [imageUrl]);

  return (
    <div className="absolute inset-0 -z-10 h-screen w-full">
      <div className="relative h-full w-full overflow-hidden">
        <Image
          {...imageProps}
          alt={movieTitle}
          className="h-full w-full object-cover"
          priority
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${getBlurDataUrl()}`}
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#121212]/100 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function getBlurDataUrl() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9">
      <rect width="16" height="9" fill="#121212"/>
    </svg>
  `;
  return Buffer.from(svg).toString("base64");
}
