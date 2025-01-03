import Image from "next/image";
import { useMemo } from "react";

interface MoviePosterProps {
  posterPath: string;
  title: string;
}

export default function MoviePoster({ posterPath, title }: MoviePosterProps) {
  const imageProps = useMemo(() => {
    // TMDB의 더 작은 크기의 이미지를 사용하여 초기 로딩 속도 향상
    const imageUrl = `https://image.tmdb.org/t/p/w342/${posterPath}`;

    return {
      src: imageUrl,
      width: 500,
      height: 750,
      // 렌더링 성능 최적화를 위해 quality 조정
      quality: 70,
      // 디바이스 크기에 따른 최적화된 크기 설정
      sizes:
        "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 500px",
    };
  }, [posterPath]);

  return (
    <div
      className="relative aspect-[2/3] w-full overflow-hidden rounded-xl"
      style={{ contain: "paint layout" }} // 렌더링 성능 최적화
    >
      <Image
        {...imageProps}
        alt={title}
        priority
        loading="eager"
        fetchPriority="high"
        decoding="sync" // 동기적 디코딩으로 변경
        className="absolute h-full w-full transform object-cover will-change-transform"
        style={{
          transform: "translateZ(0)", // 하드웨어 가속 활성화
          backfaceVisibility: "hidden",
        }}
        onLoad={(e) => {
          // 이미지 로드 완료 시 최적화
          const img = e.target as HTMLImageElement;
          img.style.visibility = "visible";
        }}
      />
    </div>
  );
}
