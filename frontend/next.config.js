/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { turbo: false },
  // 👇 Le dices a Next que la raíz de las páginas está en /src
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  dir: './src',
};

module.exports = nextConfig;
