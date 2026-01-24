import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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