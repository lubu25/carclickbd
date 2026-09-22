export const getBaseUrl = (): string => {
  return process.env.NODE_ENV === 'development'
    ? "/api/v1"
    : (process.env.NEXT_PUBLIC_API_BASE_URL || "https://carclickbd-backend.jdmcarworld.com/api/v1");
};
