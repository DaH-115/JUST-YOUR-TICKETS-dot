import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Just Your Tickets",
    short_name: "JYT",
    description: "Make your own movie ticket",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
