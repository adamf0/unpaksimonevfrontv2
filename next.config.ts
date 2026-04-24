import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  generateBuildId: async () => "build",
  poweredByHeader: false,
  headers() {
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

          // content security policy (IMPORTANT)
          // {
          //   key: "Content-Security-Policy",
          //   value: `
          //     default-src 'self';
          //     script-src 'self';
          //     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
          //     font-src 'self' https://fonts.gstatic.com;
          //     img-src 'self' data:;
          //     connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
          //     frame-ancestors 'none';
          //   `
          //     .replace(/\s{2,}/g, " ")
          //     .trim(),
          // },

          // prevent caching sensitive data
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },

          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
