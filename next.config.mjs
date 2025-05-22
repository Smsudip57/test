/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true, 
    images: {
      domains: ['api.webmedigital.com', "localhost","server.webmedigital.com"],
    },
  };
  
  export default nextConfig;
  
