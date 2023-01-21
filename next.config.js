/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['image.tmdb.org'],
    loader: 'akamai',
    path: '/',
  },
  async redirects() {
    return [
      {
        source: '/write',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/ticket-list',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/search',
        destination: '/sign-in',
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
