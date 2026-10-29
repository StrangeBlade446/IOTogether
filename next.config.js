const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/items',
        destination: '/receiver/explore',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/catalog',
        destination: '/receiver/explore',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/equipment',
        destination: '/receiver/explore',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/recipes',
        destination: '/receiver/project-recipe',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/chef',
        destination: '/receiver/project-recipe',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/desk',
        destination: '/sender',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/lab',
        destination: '/receiver',
        permanent: true, // 301 Permanent Redirect
      },
      {
        source: '/inventory',
        destination: '/sender/inventory',
        permanent: true, // 301 Permanent Redirect
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;
