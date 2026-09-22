"use client";

import { getBaseUrl } from "@/helpers/config/envConfig";
import { useLiveData } from "@/hooks/useLiveData";

interface UserActivity {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  status: "online" | "offline" | "away";
}

export default function Comments() {
  const { data, isLoading, error } = useLiveData(["comments"], {
    endPoint: "/product/comment/67685ac304ebb8c44f22a4fd",
  });
  console.log(getBaseUrl());
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  console.log(data, "________________________xxx");
  return <></>;
}
