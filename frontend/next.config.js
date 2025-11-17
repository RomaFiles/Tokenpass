/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Si quieres permitir extensiones personalizadas, esto sí es válido
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // dir: './src',
  // ❗ Next.js ya NO soporta "dir" dentro de la config
  // Si tu proyecto realmente tiene un "src", no necesitas configurarlo
  // Next lo detecta automáticamente.
};

module.exports = nextConfig;