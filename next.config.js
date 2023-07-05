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
  // redirect / to login
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
