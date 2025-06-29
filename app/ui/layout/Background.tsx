import Image from "next/image";

interface BackgroundProps {
  imageUrl: string;
  isFixed?: boolean;
}

export default function Background({
  imageUrl,
  isFixed = false,
}: BackgroundProps) {
  const blurImageUrl = `https://image.tmdb.org/t/p/w342/${imageUrl}`;

  return (
    <div
      className={`${isFixed ? "fixed" : "absolute"} inset-0 -z-10 min-h-screen w-full transition-all duration-1000 ease-out`}
    >
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
      {/* 기존 히어로 섹션과 동일한 그라데이션 오버레이 */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20" />
    </div>
  );
}
