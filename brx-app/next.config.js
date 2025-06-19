/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["cdn.exercise.com"],
  },
};

module.exports = nextConfig;
