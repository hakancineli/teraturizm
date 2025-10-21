import type { NextConfig } from "next";
import path from "path";

const config: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Monorepo kökü: /Users/hakancineli/teraturizm
  outputFileTracingRoot: path.join(__dirname, ".."),
  async rewrites() {
    return [
      // Rewrite all asset requests to the original domain
      {
        source: '/uploads/:path*',
        destination: 'https://www.teraturizm.com/uploads/:path*',
      },
      {
        source: '/css/:path*',
        destination: 'https://www.teraturizm.com/css/:path*',
      },
      {
        source: '/js/:path*',
        destination: 'https://www.teraturizm.com/js/:path*',
      },
      {
        source: '/assets/:path*',
        destination: 'https://www.teraturizm.com/assets/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'https://www.teraturizm.com/images/:path*',
      },
      {
        source: '/fonts/:path*',
        destination: 'https://www.teraturizm.com/fonts/:path*',
      },
    ];
  },
};

export default config;
