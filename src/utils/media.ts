const BACKEND_ORIGIN = "https://carclickbd-backend.jdmcarworld.com";

export const getMediaUrl = (url?: string | null) => {
  if (!url) {
    return "/placeholder.png";
  }

  // Keep backend assets on the deployed site's origin so they use the same
  // Next.js proxy as API requests.
  if (url.startsWith(`${BACKEND_ORIGIN}/`)) {
    return url.slice(BACKEND_ORIGIN.length);
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

  // Relative paths starting with /uploads/ are served through the Next.js proxy.
  if (url.startsWith("/uploads/")) {
    return url;
  }

  // Some images might come as "uploads/..." without leading slash
  if (url.startsWith("uploads/")) {
    return `/${url}`;
  }

  // Any other relative path that looks like a backend asset.
  if (url.startsWith("/") && !url.startsWith("/_next")) {
    return url;
  }

  return url;
};
