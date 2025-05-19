/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  allowedDevOrigins: ["preview.followly.eu", "dev.followly.eu", "live.followly.eu"],
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_KEY: process.env.SANITY_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

module.exports = nextConfig;
