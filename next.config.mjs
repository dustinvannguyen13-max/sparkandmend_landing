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
  async redirects() {
    return [
      {
        source: "/features",
        destination: "/basic-clean",
        permanent: true,
      },
      {
        source: "/features/link-shortening",
        destination: "/basic-clean",
        permanent: true,
      },
      {
        source: "/features/password-protection",
        destination: "/intermediate-clean",
        permanent: true,
      },
      {
        source: "/features/analytics",
        destination: "/advanced-clean",
        permanent: true,
      },
      {
        source: "/features/qr-codes",
        destination: "/commercial-cleaning",
        permanent: true,
      },
      {
        source: "/changelog",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
