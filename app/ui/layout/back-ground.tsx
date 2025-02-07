import Image from "next/image";

interface BackGroundProps {
  imageUrl: string;
  movieTitle: string;
}

export default function BackGround({
  imageUrl,
  movieTitle = "Background Image",
}: BackGroundProps) {
  const blurImageUrl = `https://image.tmdb.org/t/p/w342/${imageUrl}`;

  return (
    <div className="absolute top-[90%] -z-10 h-dvh w-full">
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${imageUrl}`}
          alt={movieTitle}
          fill
          priority
          quality={70}
          sizes="(max-width: 640px) 780px, (max-width: 1024px) 1280px, 100vw"
          placeholder="blur"
          blurDataURL={blurImageUrl}
          className="object-cover"
        />
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#121212]/100 via-transparent to-[#121212]/100"
        aria-hidden
      />
    </div>
  );
}
