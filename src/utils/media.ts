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

  if (url.startsWith("/uploads/") || url.startsWith("uploads/") || url.startsWith("\\uploads\\")) {
    const cleanUrl = url.startsWith("/") || url.startsWith("\\") ? url : `/${url}`;
    // Always use forward slashes for URLs
    return `${getApiOrigin()}${cleanUrl.replace(/\\/g, "/")}`;
  }

  // Handle cases where the URL might be a relative path that needs the API origin
  if (!url.startsWith("http") && !url.startsWith("data:") && !url.startsWith("blob:") && !url.startsWith("/")) {
      return `${getApiOrigin()}/${url.replace(/\\/g, "/")}`;
  }

  return url;
};
