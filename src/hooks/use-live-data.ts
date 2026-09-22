"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";

interface FetchConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
}

export function useLiveData<TData>(
  key: string | string[],
  fetchConfig: FetchConfig,
  options?: Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn"> & {
    refetchInterval?: number;
    keepPreviousData?: boolean;
  },
) {
  const queryKey = Array.isArray(key) ? key : [key];

  return useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const { url, method = "GET", headers = {}, body } = fetchConfig;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    refetchInterval: options?.refetchInterval ?? false,
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
    keepPreviousData: options?.keepPreviousData ?? true,
    ...options,
  });
}
