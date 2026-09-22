export const getBaseUrl = (): string => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "https://carclickbd-backend.jdmcarworld.com/api/v1";
  }
  return "/api/v1";
};
