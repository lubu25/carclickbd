export const getBaseUrl = (): string => {
  // Browser requests must stay on the deployed site's origin. Next.js proxies
  // this path to the backend, avoiding CORS and cookie-origin issues.
  if (typeof window !== "undefined") {
    return "/api/v1";
  }

  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "https://carclickbd-backend.jdmcarworld.com/api/v1"
  );
};
