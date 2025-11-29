/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://nike-clone.example.com',
  },
  // Add output configuration for proper static generation
  output: 'standalone',
}

module.exports = nextConfig