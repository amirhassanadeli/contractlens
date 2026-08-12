import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  allowedDevOrigins: ["api.amirhassanadeli.com", "80.191.185.94"],
} satisfies NextConfig;

export default nextConfig;
