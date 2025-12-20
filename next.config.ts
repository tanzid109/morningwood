const nextConfig = {
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
    ],
  },
};

module.exports = nextConfig;
