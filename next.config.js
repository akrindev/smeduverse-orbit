/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-right",
  },
  images: {
    domains: ["images.unsplash.com", "source.unsplash.com", "picsum.photos"],
  },
};

module.exports = nextConfig;
