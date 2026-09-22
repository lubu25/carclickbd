export const updateSearchParams = (
  params: Record<string, string | undefined>,
  url: string = window.location.href,
) => {
  const currentUrl = new URL(url);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      currentUrl.searchParams.set(key, value);
    } else {
      currentUrl.searchParams.delete(key);
    }
  });

  window.history.pushState({}, "", currentUrl);
};
