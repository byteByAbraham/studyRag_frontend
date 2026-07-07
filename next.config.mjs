/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
      },
      // Si tienes registro, puedes añadir esta línea también:
      {
        source: '/register',
        destination: '/auth/register',
      },
    ];
  },
};

export default nextConfig;