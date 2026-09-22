import { UseQueryOptions } from "@tanstack/react-query";

export type FetchConfig = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endPoint: string;
  body?: Record<string, any>;
};

export type LiveDataOptions<TData> = Omit<
  UseQueryOptions<TData, Error>,
  "queryKey" | "queryFn"
> & {
  refetchInterval?: number;
  keepPreviousData?: boolean;
};
