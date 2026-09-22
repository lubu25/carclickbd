const BACKEND_ORIGIN = "https://carclickbd-backend.jdmcarworld.com";

export const getMediaUrl = (url?: string | null) => {
  if (!url) {
    return "/placeholder.png";
  }

  // Already an absolute URL — return as is
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  // Relative paths starting with /uploads/ — prepend the backend origin
  if (url.startsWith("/uploads/")) {
    return `${BACKEND_ORIGIN}${url}`;
  }

  // Some images might come as "uploads/..." without leading slash
  if (url.startsWith("uploads/")) {
    return `${BACKEND_ORIGIN}/${url}`;
  }

  // Any other relative path that looks like a backend asset
  if (url.startsWith("/") && !url.startsWith("/_next")) {
    return `${BACKEND_ORIGIN}${url}`;
  }

  return url;
};
