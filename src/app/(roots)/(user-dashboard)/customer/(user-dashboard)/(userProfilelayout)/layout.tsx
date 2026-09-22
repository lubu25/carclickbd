"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/Redux/hooks";
import { IUser } from "@/Interface/user";
import PageLoader from "@/components/shared/spinners/PageLoader";
import ProfilePictureUploader from "@/components/dashboardlayout/profile/ProfilePictureUploader";
import { Card, Button } from "antd";
import { UserOutlined, LockOutlined, HistoryOutlined, PictureOutlined } from "@ant-design/icons";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);
  const profileInfo = useAppSelector((state) => state.authReducer.profile);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <PageLoader />;

  const navItems = [
    { path: "/customer/profile", label: "User Details / Update", icon: <UserOutlined /> },
    { path: "/customer/profile/account-history", label: "Account History", icon: <HistoryOutlined /> },
    { path: "/customer/profile/change-password", label: "Change Password", icon: <LockOutlined /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-[#1B324C] text-center text-white py-6 shadow-md">
          <ProfilePictureUploader user={profileInfo as IUser} />
          <h3 className="font-bold text-lg mt-3">{profileInfo?.name}</h3>
          <p className="text-sm text-gray-200">{profileInfo?.email}</p>
          <p className="text-sm text-gray-300">{profileInfo?.role}</p>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-6">
          <Card className="col-span-12 md:col-span-3 p-4 shadow-lg min-h-screen">
            {navItems.map(({ path, label, icon }) => (
              <Link key={path} href={path} >
                <Button
                  type={pathname === path ? "primary" : "default"}
                  block
                  className="flex items-center justify-start gap-2 text-left my-2 p-3"
                >
                  {icon} {label}
                </Button>
              </Link>
            ))}
          </Card>
          
          <main className="col-span-12 md:col-span-9 bg-white p-6 shadow-lg rounded-lg">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
