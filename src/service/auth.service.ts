"use client";
import { authInfoKey, authKey, PROFILE_INFO_KEY } from "@/constant/storegeKey";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  getFromLocalStorage,
  setToLocalStorageAsStringify,
} from "@/utils/local-storage";
import { jwtDecode } from "jwt-decode";

const clearAuthStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PROFILE_INFO_KEY);
    localStorage.removeItem(authKey);
    localStorage.removeItem(authInfoKey);
  }
};

// Store the access token in localStorage
export const storeToken = ({ accessToken }: { accessToken: string }) => {
  if (!accessToken || accessToken === "undefined" || accessToken === "null") return;
  const cleanToken = accessToken.startsWith("Bearer ")
    ? accessToken.split(" ")[1]
    : accessToken;
  const tokenWithBearer = `Bearer ${cleanToken}`;
  localStorage.setItem(authKey, tokenWithBearer);
  localStorage.removeItem(authInfoKey);
};

// Handle login
export const handleLoggedIn = (token: string) => {
  storeToken({ accessToken: token });
};

// Check if user is logged in and validate token expiration
export const isLoggedIn = () => {
  const token = getFromLocalStorage(authKey);
  if (!token) return false;

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const decodedToken = jwtDecode(cleanToken as string);
    if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
      clearAuthStorage();
      return false;
    }
    return true;
  } catch (error) {
    clearAuthStorage();
    return false;
  }
};

// Get token information and check expiration
export const getTokenInfo = (): any => {
  const token = getFromLocalStorage(authKey);
  if (!token) return null;

  try {
    const cleanToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    const userDecodedData = jwtDecode(cleanToken as string);
    if (userDecodedData.exp && userDecodedData.exp < Math.floor(Date.now() / 1000)) {
      clearAuthStorage();
      return null;
    }
    setToLocalStorageAsStringify(authInfoKey, userDecodedData);
    return userDecodedData;
  } catch (error) {
    clearAuthStorage();
    return null;
  }
};

// Handle Logout and redirect to login page
export const Logout = () => {
  if (typeof window !== "undefined") {
    clearAuthStorage();
    window.location.href = "/login"; 
  }
};

// Remove token info by key
export const removetokenInfo = (key: string) => {
  return localStorage.removeItem(key);
};

// Refresh access token
export const getNewAccessToken = async () => {
  try {
    const response = await axiosInstance({
      url: `${getBaseUrl()}/auth/get-new-accessToken`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    if (response.data?.accessToken) {
      storeToken({ accessToken: response.data.accessToken });
      return response.data.accessToken;
    } else {
      Logout(); // Log out if token refresh fails
      return null;
    }
  } catch (error) {
    Logout();
    return null;
  }
};

// Get access token (example hardcoded token for testing, replace with actual logic)
export const getAccessToken = async () => {
  const token = getFromLocalStorage(authKey);
  if (!token) return null;
  return token.startsWith("Bearer ") ? token.split(" ")[1] : token;
};
