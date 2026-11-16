import type { NextConfig } from 'next';

/**
 * Security headers for every page (PRD §25.2). A Content-Security-Policy is left to the reverse
 * proxy, where the final API and web domains are known (docs/DEPLOYMENT.md §7).
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // The camera is used to scan invoices from a phone browser; nothing else is allowed.
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(), payment=()' },
];

/**
 * Optional: serve the API through this app at /backend, so web and API share one public address
 * (needed for the SameSite=strict refresh cookie when sharing via a tunnel or a free host).
 * Set at build time together with NEXT_PUBLIC_API_URL=/backend and the API's COOKIE_PATH=/backend/auth.
 */
const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async rewrites() {
    return apiProxyTarget
      ? [{ source: '/backend/:path*', destination: `${apiProxyTarget}/:path*` }]
      : [];
  },
};

export default nextConfig;
