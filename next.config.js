/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    ABI: process.env.ABI,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
  },
};

module.exports = nextConfig;
