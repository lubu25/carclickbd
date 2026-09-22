"use client";
import { useGetUserByIdQuery } from "@/Redux/api/userApi";
import { useAppSelector } from "@/Redux/hooks";
import { useEffect, useState } from "react";
import { getTokenInfo } from "./auth.service";
import { IUser } from "@/Interface/user";

const GetUserInfo = () => {
  const isLoggedin = useAppSelector((state) => state.authReducer.isLoggedIn);
  const [profileInfo, setProfileInfo] = useState<IUser | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("profileInfo");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  // Call the hook at the top level
  const tokenInfo = getTokenInfo();
  const userId = tokenInfo?.userId;
  const { data, isLoading = false } = useGetUserByIdQuery(userId, {
    skip: !isLoggedin || !userId || !!profileInfo, // Skip the query if profileInfo already exists
  });

  useEffect(() => {
    if (data?.data && !profileInfo) {
      // Set the user info in state and save it to local storage
      setProfileInfo(data.data);
      localStorage.setItem("profileInfo", JSON.stringify(data.data));
    }
  }, [data, profileInfo, isLoading]);

  return { profileInfo, isLoading };
};

export default GetUserInfo;
