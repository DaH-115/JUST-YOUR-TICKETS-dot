"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";

interface MoviePosterProps {
  posterPath?: string;
  title: string;
  lazy?: boolean;
}

type ImageSize = 92 | 154 | 185 | 342 | 500;

export default function MoviePoster({
  posterPath,
  title,
  lazy = false,
}: MoviePosterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [optimalSize, setOptimalSize] = useState<ImageSize>(342);

  // 컨테이너 크기에 따른 최적 이미지 크기 계산
  const getOptimalImageSize = (width: number): ImageSize => {
    if (width <= 92) return 92;
    if (width <= 154) return 154;
    if (width <= 185) return 185;
    if (width <= 400) return 342; // 400px까지는 w342 사용
    return 500;
  };

  // 컨테이너 크기 감지 및 최적 이미지 크기 설정
  useEffect(() => {
    const updateOptimalSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newOptimalSize = getOptimalImageSize(rect.width);
        if (newOptimalSize !== optimalSize) {
          setOptimalSize(newOptimalSize);
        }
      }
    };

    // 초기 설정
    updateOptimalSize();

    // 디바운스로 ResizeObserver 콜백 최적화 (100ms 지연)
    const debouncedUpdate = debounce(updateOptimalSize, 100);

    // ResizeObserver로 크기 변화 감지
    const resizeObserver = new ResizeObserver(debouncedUpdate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [optimalSize]);

  // 반응형 sizes 속성 생성
  const generateSizes = () => {
    return "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw";
  };

  return (
    <figure ref={containerRef} className="relative h-full w-full">
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w${optimalSize}/${posterPath}`}
          alt={title}
          fill
          quality={75}
          priority={!lazy}
          loading={lazy ? "lazy" : "eager"}
          className="object-cover"
          sizes={generateSizes()}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPYe0YQ1AAAAABJRU5ErkJggg=="
        />
      ) : (
        <figcaption className="absolute inset-0 flex items-center justify-center bg-primary-700 p-4 text-white">
          <span className="text-sm">
            {title || "Make a ticket for your own movie review."}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
