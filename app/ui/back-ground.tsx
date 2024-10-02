import Image from "next/image";

export default function BackGround({
  imageUrl,
  movieTitle,
}: {
  imageUrl: string | undefined;
  movieTitle: string | undefined;
}) {
  return (
    <div className="w-ful absolute inset-0 z-0">
      <Image
        src={`https://image.tmdb.org/t/p/original${imageUrl}`}
        alt={movieTitle || "background image"}
        width={1280}
        height={720}
        priority
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white/100 to-transparent" />
    </div>
  );
}
