import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddddddddddddddfffffff.s3.ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "my-streams-bucket-ap-south-1.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  // Empty turbopack config to silence the warning
  turbopack: {},
  // Keep webpack config for compatibility
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'amazon-ivs-web-broadcast'];
    }
    return config;
  },
};

export default nextConfig;