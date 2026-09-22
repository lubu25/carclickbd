import { useSearchParams } from "next/navigation";

/**
 * A reusable function to get a specific search parameter value from the URL.
 * @param paramName The name of the query parameter to fetch.
 * @returns The value of the query parameter, or `null` if not found.
 */
export const useQueryParam = (paramName: string): string | null => {
  const searchParams = useSearchParams();
  return searchParams.get(paramName);
};
