// 1. Build-time environment variable check
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL', 
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
];

requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`❌ Error: Missing required env var: ${key}. Build failed to ensure production stability.`);
  }
});

import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let hostname = '';

if (supabaseUrl && supabaseUrl !== 'your-project-url') {
  try {
    hostname = new URL(supabaseUrl).hostname;
  } catch (e) {
    console.error('Invalid NEXT_PUBLIC_SUPABASE_URL', e);
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hostname ? [
      {
        protocol: 'https',
        hostname: hostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ] : [],
  },
};

export default nextConfig;
