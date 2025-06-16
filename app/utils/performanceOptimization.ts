/**
 * 성능 최적화를 위한 유틸리티 함수들
 */

// requestAnimationFrame을 사용한 throttle 함수
export const rafThrottle = (callback: () => void) => {
  let ticking = false;
  return () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };
};

// debounce 함수
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 스크롤 이벤트 최적화 훅
export const createOptimizedScrollHandler = (
  callback: (scrollY: number) => void,
) => {
  return rafThrottle(() => {
    callback(window.scrollY);
  });
};

// 리사이즈 이벤트 최적화 훅
export const createOptimizedResizeHandler = (
  callback: (width: number, height: number) => void,
) => {
  return rafThrottle(() => {
    callback(window.innerWidth, window.innerHeight);
  });
};

// 폰트 로딩 최적화
export const preloadFont = (fontUrl: string, fontType: string = "woff2") => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.type = `font/${fontType}`;
    link.href = fontUrl;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  }
};

// 중요 리소스 프리로드
export const preloadResource = (url: string, as: string) => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
  }
};

// DNS 프리페치
export const prefetchDNS = (domain: string) => {
  if (typeof window !== "undefined") {
    const link = document.createElement("link");
    link.rel = "dns-prefetch";
    link.href = domain;
    document.head.appendChild(link);
  }
};

// 이미지 지연 로딩 최적화
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit,
) => {
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    return new IntersectionObserver(callback, {
      rootMargin: "50px",
      threshold: 0.1,
      ...options,
    });
  }
  return null;
};
