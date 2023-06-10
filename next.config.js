/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
};

module.exports = nextConfig;
