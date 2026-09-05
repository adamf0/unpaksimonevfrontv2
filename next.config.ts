import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";
const repoName = process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}` : "";

const nextConfig: NextConfig = {
  output: isExport ? "export" : "standalone",
  basePath: isExport ? repoName : undefined,
  assetPrefix: isExport ? repoName : undefined,
  compress: true,
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  generateBuildId: async () => "build",
  poweredByHeader: false,
  devIndicators: false,
  ...(isExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                // prevent MIME sniffing
                {
                  key: "X-Content-Type-Options",
                  value: "nosniff",
                },

                // clickjacking protection
                {
                  key: "X-Frame-Options",
                  value: "DENY",
                },

                // XSS basic protection (legacy but still useful)
                {
                  key: "X-XSS-Protection",
                  value: "1; mode=block",
                },

                // referrer control
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },

                // permissions lockdown
                {
                  key: "Permissions-Policy",
                  value: "geolocation=(), microphone=(), camera=(), payment=()",
                },

                // enforce HTTPS (browser side)
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },

                // prevent caching sensitive data
                {
                  key: "Cache-Control",
                  value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
                {
                  key: "Pragma",
                  value: "no-cache",
                },
                {
                  key: "Expires",
                  value: "0",
                },

                {
                  key: "X-Robots-Tag",
                  value: "noindex, nofollow, noarchive",
                },
              ],
            },
          ];
        },
      }),
  images: {
    unoptimized: isExport,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
