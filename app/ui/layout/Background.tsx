import Image from "next/image";

interface BackgroundProps {
  imageUrl: string;
}

export default function Background({ imageUrl }: BackgroundProps) {
  const blurImageUrl = `https://image.tmdb.org/t/p/w342/${imageUrl}`;

  return (
    <div className="absolute inset-0 -z-10 min-h-screen w-full">
      <div className="relative h-full min-h-[100vh] w-full overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original/${imageUrl}`}
          alt=""
          role="presentation"
          width={1920}
          height={1080}
          priority
          quality={100}
          placeholder="blur"
          blurDataURL={blurImageUrl}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/100 via-[#121212]/60 to-[#121212]/100" />
    </div>
  );
}
