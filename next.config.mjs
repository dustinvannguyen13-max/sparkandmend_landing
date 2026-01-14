/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fmijmundotmgtsemfdat.supabase.co",
        pathname: "/storage/v1/object/public/media/**",
      },
      {
        protocol: "https",
        hostname: "images.squarespace-cdn.com",
        pathname: "/content/**",
      },
    ],
  },
};

export default nextConfig;
