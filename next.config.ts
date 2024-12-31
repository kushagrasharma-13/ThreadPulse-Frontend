import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {hostname: "preview.redd.it"}, 
      {hostname: "styles.redditmedia.com"}, 
      {hostname: "b.thumbs.redditmedia.com"},
      {hostname: "external-preview.redd.it"}, 
    ], // Add the required hostname here
  },
  /* other config options here */
};

export default nextConfig;
