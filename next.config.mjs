/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages (Static HTML Export) serves the `out/` directory
  // directly, so custom routes like headers()/redirects()/rewrites() are
  // not supported here. Security headers are defined in public/_headers
  // instead, which Cloudflare Pages applies natively.
  output: "export",
};

export default nextConfig;
