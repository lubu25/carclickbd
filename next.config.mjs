/** @type {import('next').NextConfig} */
const defaultApiBaseUrl =
  'https://carclickbd-backend.jdmcarworld.com/api/v1';
const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL || defaultApiBaseUrl
).replace(/\/+$/, '');
const backendOrigin = new URL(apiBaseUrl).origin;

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendOrigin}/uploads/:path*`,
      },
      {
        source: '/api/jpcenter/:path*',
        destination: 'https://jpcenter.ru/api/:path*',
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: [
      "img.freepik.com",
      "i.ibb.co",
      "media.carsandbids.com",
      "as1.ftcdn.net",
      "shop.roadster.com",
      "www.mbusa.com",
      "cdn-icons-png.flaticon.com",
      "discordapp.com",
      "images.pexels.com",
      "images.unsplash.com",
      "content.copart.com",
      "cs.copart.com",
      "cdn.discordapp.com",
      "encrypted-tbn0.gstatic.com",
      "www.pngmart.com",
      "www.pngall.com",
      "cdn.pixabay.com",
      "carclickbd-backend.jdmcarworld.com"
    ],
  },
};

export default nextConfig;
