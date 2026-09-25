const BACKEND_ORIGIN = "https://carclickbd-backend.jdmcarworld.com";
export const FALLBACK_MEDIA_URL = "/assets/shared/car.png";

export const getMediaUrl = (url?: string | null) => {
  if (!url?.trim()) return FALLBACK_MEDIA_URL;

  const value = url.trim();

  // Keep backend assets on the deployed site's origin so they use the same
  // Next.js proxy as API requests.
  try {
    const parsed = new URL(value, BACKEND_ORIGIN);
    if (parsed.origin === BACKEND_ORIGIN) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    return FALLBACK_MEDIA_URL;
  }

  // Already an absolute URL — return as is
  if (
    /^(https?:\/\/|data:|blob:)/i.test(value)
  ) {
    return value;
  }

  // Relative paths starting with /uploads/ are served through the Next.js proxy.
  if (value.startsWith("/uploads/")) {
    return value;
  }

  // Some images might come as "uploads/..." without leading slash
  if (value.startsWith("uploads/")) {
    return `/${value}`;
  }

  // Any other relative path that looks like a backend asset.
  if (value.startsWith("/") && !value.startsWith("/_next")) {
    return value;
  }

  return value;
};
