import type { NextConfig } from "next";

// Served from a custom domain (absolutepitch.ruka.my) at the root, so no
// basePath/assetPrefix is needed — only static export for GitHub Pages.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
