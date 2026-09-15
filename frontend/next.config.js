/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    if (base) {
      return [{ source: "/api/:path*", destination: `${base.replace(/\/$/, "")}/api/:path*` }];
    }
    return [];
  },
};
module.exports = nextConfig;
