// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Native modules like better-sqlite3 should be kept external on the server.
  serverExternalPackages: ['better-sqlite3'],
};

export default nextConfig;

