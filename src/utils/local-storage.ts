"use client";
export const setToLocalStorageAsStringify = (key: string, data: any) => {
  if (!key || typeof window === "undefined") {
    return "";
  }

  return localStorage.setItem(key, JSON.stringify(data));
};

export const getFromLocalStorageAsParse = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  const stringifyData = localStorage.getItem(key);
  const parseData = JSON.parse(stringifyData as string);
  return parseData || null;
};

export const setToLocalStorage = (key: string, data: any) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.setItem(key, data);
};

export const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(key);
};

export const removeFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.removeItem(key);
};

export const setThemeStatusLocalStorage = (
  key: string,
  value: string
): void => {
  if (!key || typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, value.toString());
};
