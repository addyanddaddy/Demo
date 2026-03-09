/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    // Allow builds even with type errors during early development
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow builds even with lint errors during early development
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
