const BACKEND_URL = new URL(
  process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://carclickbd-backend.jdmcarworld.com/api/v1",
);
const BACKEND_ORIGIN = BACKEND_URL.origin;
const BACKEND_HOSTNAME = BACKEND_URL.hostname;
export const FALLBACK_MEDIA_URL = "/assets/shared/car.png";

export const getMediaUrl = (url?: string | null) => {
  if (!url?.trim()) return FALLBACK_MEDIA_URL;

  const value = url.trim();

  if (/^(data:|blob:)/i.test(value)) return value;

  const normalizeUploadPath = (pathname: string) => {
    const apiPrefix = BACKEND_URL.pathname.replace(/\/+$/, "");
    const normalizedPath =
      apiPrefix && pathname.startsWith(`${apiPrefix}/`)
        ? pathname.slice(apiPrefix.length)
        : pathname;
    return normalizedPath.startsWith("/uploads/") ? normalizedPath : undefined;
  };

  // Serve backend uploads through the same-origin Next.js proxy. This also
  // handles old records containing localhost or plain-HTTP upload URLs.
  try {
    const parsed = new URL(value, BACKEND_ORIGIN);
    const isBackendHost =
      parsed.hostname === BACKEND_HOSTNAME ||
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1";
    const uploadPath = isBackendHost
      ? normalizeUploadPath(parsed.pathname) ||
        parsed.pathname.match(/\/uploads\/.*$/)?.[0]
      : undefined;

    if (uploadPath) {
      return `${uploadPath}${parsed.search}${parsed.hash}`;
    }

    if (isBackendHost && /^https?:\/\//i.test(value)) {
      parsed.protocol = "https:";
      return parsed.toString();
    }

    if (parsed.origin === BACKEND_ORIGIN && !/^https?:\/\//i.test(value)) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    if (/^https?:\/\//i.test(value)) return FALLBACK_MEDIA_URL;
  }

  // Already an absolute URL — return as is
  if (/^https?:\/\//i.test(value)) {
    return value.replace(
      /^http:\/\/res\.cloudinary\.com\//i,
      "https://res.cloudinary.com/",
    );
  }

  if (value.startsWith("/")) {
    return value;
  }

  return FALLBACK_MEDIA_URL;
};
