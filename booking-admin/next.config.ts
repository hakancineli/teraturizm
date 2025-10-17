import type { NextConfig } from "next";
import path from "path";

const config: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Monorepo kökü: /Users/hakancineli/teraturizm
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default config;
