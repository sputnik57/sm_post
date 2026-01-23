import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This ensures the App Router looks in the right place
  // Even though src is auto-detected, being explicit helps Vercel
  experimental: {
    // (No specific experimental flags needed, but keeping the structure)
  },
};

export default nextConfig;