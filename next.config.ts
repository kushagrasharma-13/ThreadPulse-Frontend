import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "preview.redd.it" },
      { hostname: "styles.redditmedia.com" },
      { hostname: "b.thumbs.redditmedia.com" },
      { hostname: "external-preview.redd.it" },
    ],
  },
  async headers() {
    return [
      {
        // Match all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Replace "*" with specific domains if needed
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  // Other config options here
};

export default nextConfig;
