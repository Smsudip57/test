/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['api.webmedigital.com', "localhost", "server.webmedigital.com"],
    unoptimized: process.env.NODE_ENV === 'development', // Disable optimization in dev to prevent timeout errors
  },
};

export default nextConfig;

