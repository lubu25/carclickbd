export const getBaseUrl = (): string => {
  // On the server side, always talk directly to the backend
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://carclickbd-backend.jdmcarworld.com/api/v1";
  }

  // On the client side, try the rewrite first (/api/v1).
  // If the NEXT_PUBLIC_API_BASE_URL env var is set, use it directly instead
  // (this makes the app work even when Next.js rewrites fail on certain hosts).
  return process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
};
