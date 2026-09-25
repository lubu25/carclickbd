"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { FALLBACK_MEDIA_URL, getMediaUrl } from "@/utils/media";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export default function SafeImage({ src, alt, onError, ...props }: SafeImageProps) {
  const normalizedSrc = getMediaUrl(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  return (
    <Image
      {...props}
      src={hasError ? FALLBACK_MEDIA_URL : normalizedSrc}
      alt={alt}
      onError={(event) => {
        if (!hasError) setHasError(true);
        onError?.(event);
      }}
    />
  );
}
