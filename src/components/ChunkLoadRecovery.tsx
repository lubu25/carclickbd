"use client";

import { useEffect } from "react";

const CHUNK_RELOAD_KEY = "carclickbd_chunk_reload_attempted";

const isChunkLoadError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  return /ChunkLoadError|Loading chunk \d+ failed|missing.*chunk/i.test(
    message,
  );
};

const reloadOnce = () => {
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === "true") {
    return;
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, "true");
  window.location.reload();
};

const ChunkLoadRecovery = () => {
  useEffect(() => {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);

    const handleError = (event: ErrorEvent) => {
      if (isChunkLoadError(event.error || event.message)) {
        reloadOnce();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        reloadOnce();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  return null;
};

export default ChunkLoadRecovery;
