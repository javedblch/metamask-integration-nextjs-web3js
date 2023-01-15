/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    ABI: process.env.ABI,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
  },
};

module.exports = nextConfig;
