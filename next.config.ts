import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.sentry.io https://*.upstash.io https://*.ingest.sentry.io wss: ws:;
  frame-ancestors 'none';
`;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.25.144.1", "localhost", "127.0.0.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, "").replace(/\s+/g, " ").trim(),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || "vision-labs",
  project: process.env.SENTRY_PROJECT || "javascript-nextjs",
  silent: true,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: true,
  },
  webpack: {
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
