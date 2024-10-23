import Image from "next/image";

interface BackGroundProps {
  imageUrl?: string;
  movieTitle?: string;
}

export default function BackGround({ imageUrl, movieTitle }: BackGroundProps) {
  return (
    <div className="absolute inset-0 -z-10 h-screen w-full min-w-[320px]">
      {imageUrl && (
        <>
          <Image
            src={`https://image.tmdb.org/t/p/original${imageUrl}`}
            alt={movieTitle || "Background Image"}
            width={1280}
            height={720}
            priority
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-white/100 to-transparent" />
        </>
      )}
    </div>
  );
}
