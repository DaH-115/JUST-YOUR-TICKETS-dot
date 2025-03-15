"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Loading from "app/loading";

const ReactPlayer = dynamic(() => import("react-player/lazy"), {
  loading: () => (
    <div className="aspect-video bg-primary-700 md:rounded-xl">
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    </div>
  ),
});

interface VideoPlayerProps {
  trailerKey: string;
  thubmnailSize?: "large" | "small";
  className?: string;
  onReady?: () => void;
  onStart?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const VideoPlayer = ({
  trailerKey,
  thubmnailSize = "small",
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
            url={`https://www.youtube.com/embed/${trailerKey}`}
            width="100%"
            height="100%"
            controls
            // 썸네일 모드 활성화
            light={`https://img.youtube.com/vi/${trailerKey}/${thubmnailSize === "large" ? "maxresdefault" : "mqdefault"}.jpg`}
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
