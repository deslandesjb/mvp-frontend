/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	devIndicators: false,
	images: {
		// domains: ['static.fnac-static.com'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'static.fnac-static.com',
				pathname: '**',
			},
		],
	},
};

module.exports = nextConfig;
