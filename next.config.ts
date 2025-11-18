import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
let hostname = "";

try {
  hostname = new URL(supabaseUrl).hostname;
} catch (error) {
  console.error("Error parsing NEXT_PUBLIC_SUPABASE_URL in next.config.ts");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: hostname,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;