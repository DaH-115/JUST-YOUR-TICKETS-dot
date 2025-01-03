import { useEffect } from "react";

export function useImagePreload(imagePath: string) {
  useEffect(() => {
    if (!imagePath) return;

    const imageUrl = `https://image.tmdb.org/t/p/w500/${imagePath}`;
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = imageUrl;

    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
  }, [imagePath]);
}
