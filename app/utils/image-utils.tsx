export function getImageUrl(path: string, width: number = 500) {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/w${width}${path}`;
}

export function getBlurDataUrl() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 3">
    <rect width="2" height="3" fill="#1f1f1f"/>
  </svg>`;
  return Buffer.from(svg).toString("base64");
}
