import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // match all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" }, // For testing
          // In production, you might want to restrict this or use a more dynamic approach
          // allowing "chrome-extension://..." origins if needed. 
          // However, standard fetch from extension content scripts often looks like it's coming from the page origin if injected,
          // but popup scripts have origin chrome-extension://...
          // A wildcard '*' with credentials is not allowed. 
          // We'll add logic to allow the specific extension ID if we knew it, 
          // but for local dev with unknown ID, we might need a function or middleware.
          // For now, let's try allowing the extension protocol generally or rely on browser behavior. 
          // Actually, for extensions, simply allowing * (without credentials) or specific origin is best.
          // Since we need credentials, we must specify exact origin.
          // Let's rely on the middleware to handle dynamic origin REFLECTION if needed, 
          // but for now let's add common headers.
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
