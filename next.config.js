/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

module.exports = nextConfig;
