/** @type {import('next').NextConfig} */
const backendUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  // This tells Next.js to do a completely offline Static Export
  output: "export",
  
  // ⚠️ Rewrites are strictly strictly forbidden by Next.js when output="export"
  /*
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`
      }
    ];
  }
  */
};

export default nextConfig;
