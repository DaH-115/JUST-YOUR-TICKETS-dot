import Image from "next/image";

interface BackGroundProps {
  imageUrl: string;
  movieTitle: string;
}

export default function BackGround({
  imageUrl,
  movieTitle = "Background Image",
}: BackGroundProps) {
  return (
    <div className="absolute inset-0 -z-10 h-screen w-full">
      <div className="relative h-full w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original/${imageUrl}`}
          alt={movieTitle}
          width={1280}
          height={720}
          className="h-full w-full object-cover"
          priority
          quality={80}
          sizes={"(min-width: 320px) 100vw"}
          loading="eager"
        />
      </div>
      <span className="absolute inset-0 bg-gradient-to-t from-[#121212]/100 to-transparent" />
    </div>
  );
}
