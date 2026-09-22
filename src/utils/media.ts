import { getBaseUrl } from "@/helpers/config/envConfig";

const getApiOrigin = () => {
  // Always return the absolute backend origin to avoid rewrite issues on Hostinger
  return "https://carclickbd-backend.jdmcarworld.com";
};

export const getMediaUrl = (url?: string | null) => {
  if (!url) {
    return "/placeholder.png";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return `${getApiOrigin()}${url}`;
  }

  return url;
};
