import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://<owner>.github.io/AbsolutePitch/,
// so assets need that subpath baked in when building in CI.
const repoName = "AbsolutePitch";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(isGithubActions && {
    basePath: `/${repoName}`,
    assetPrefix: `/${repoName}/`,
  }),
};

export default nextConfig;
