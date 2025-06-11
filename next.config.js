/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const s3Host = `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com`;

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      // 기존 TMDB
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      // 구글 소셜 로그인 프로필
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      // S3에 업로드된 프로필 이미지
      {
        protocol: "https",
        hostname: s3Host,
        pathname: "/profiles/**",
      },
    ],
    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384, 512, 768, 1024],
    minimumCacheTTL: 86400,
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "index,follow" }],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: "firebase",
            chunks: "all",
            priority: 30,
          },
          aws: {
            test: /[\\/]node_modules[\\/]@aws-sdk[\\/]/,
            name: "aws-sdk",
            chunks: "all",
            priority: 25,
          },
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|swiper|react-icons)[\\/]/,
            name: "ui-libs",
            chunks: "all",
            priority: 20,
          },
          utils: {
            test: /[\\/]node_modules[\\/](lodash|zod)[\\/]/,
            name: "utils",
            chunks: "all",
            priority: 15,
          },
        },
      },
    };

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
