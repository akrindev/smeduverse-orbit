/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	devIndicators: {
		position: "bottom-right",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "source.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
				port: "",
				pathname: "/**",
			},
		],
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
