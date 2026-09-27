import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Dev only: let my phone (opening http://192.168.1.10:3000) load the dev scripts.
  // Ignored by the static build and GitHub Pages. Update the IP if your PC's address changes.
  allowedDevOrigins: ["192.168.1.10"],
};

export default nextConfig;