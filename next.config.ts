import type { NextConfig } from "next";
import { i18n } from "./i18n.config";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n, // 🔥 wichtig für Build
};

export default nextConfig;
