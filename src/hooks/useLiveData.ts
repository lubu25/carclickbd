"use client";

import { getBaseUrl } from "@/helpers/config/envConfig";
import { getAccessToken } from "@/service/auth.service";
import { FetchConfig, LiveDataOptions } from "@/types/live.data.type";
import { useQuery } from "@tanstack/react-query";

export function useLiveData<TData>(
  key: string | string[],
  fetchConfig: FetchConfig,
  options?: LiveDataOptions<TData>,
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const { endPoint, method = "GET", body } = fetchConfig;

      const token = await getAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add the Authorization header only if a valid token exists
      if (token) {
        headers["Authorization"] = token;
      }

      const response = await fetch(`${getBaseUrl()}${endPoint}`, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    refetchInterval: options?.refetchInterval ?? 5000, // Default to 5000 ms
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    keepPreviousData: options?.keepPreviousData ?? true,
    ...options,
  });
}
