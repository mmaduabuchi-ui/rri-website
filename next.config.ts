import type { NextConfig } from "next";
import * as path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, ""),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "emsmarinnugxnpwnshpd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;