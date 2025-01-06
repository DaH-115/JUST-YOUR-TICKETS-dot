"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video animate-pulse bg-gray-200 md:rounded-xl">
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    </div>
  ),
});

interface VideoPlayerProps {
  url: string;
  className?: string;
  onReady?: () => void;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const VideoPlayer = ({
  url,
  onReady,
  onStart,
  onPlay,
  onPause,
  onEnded,
}: VideoPlayerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasBeenVisible]);

  return (
    <div ref={containerRef} className="relative aspect-video h-full w-full">
      {(isVisible || hasBeenVisible) && (
        <div className="h-full w-full overflow-hidden md:rounded-xl">
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            controls
            // 썸네일 모드 활성화
            light
            // 플레이어 설정 최적화
            config={{
              youtube: {
                playerVars: {
                  // 자동재생 비활성화
                  autoplay: 0,
                  // 관련 동영상 비표시
                  rel: 0,
                  // 개인정보 보호 모드
                  host: "https://www.youtube-nocookie.com",
                  // 모듈형 브랜딩
                  modestbranding: 1,
                  // 전체화면 버튼 표시
                  fs: 1,
                },
              },
            }}
            onReady={onReady}
            onStart={onStart}
            onPlay={onPlay}
            onPause={onPause}
            onEnded={onEnded}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
