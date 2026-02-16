/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [
    '@anthropic-ai/sdk',
    'stripe',
  ],
}

module.exports = nextConfig
