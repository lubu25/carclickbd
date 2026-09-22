import { getBaseUrl } from "@/helpers/config/envConfig";

const getApiOrigin = () => {
  try {
    return new URL(getBaseUrl()).origin;
  } catch {
    return "";
  }
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
