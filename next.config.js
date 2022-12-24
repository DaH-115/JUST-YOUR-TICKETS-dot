/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'akamai',
    path: '/',
    unoptimized: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['image.tmdb.org'],
  },
  async redirects() {
    return [
      {
        source: '/write',
        destination: '/search',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
