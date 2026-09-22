"use client";
import React, { useState, useEffect } from "react";
import { Dropdown, Avatar, MenuProps, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import {
  AiOutlineUser,
  AiOutlineEye,
  AiOutlineShop,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setLogOut } from "@/Redux/Slices/authSlice";
import HasAccess from "@/routes/RoleBasedRouteGenerator";
import { getMediaUrl } from "@/utils/media";

const ProfileDropdown: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.authReducer.profile);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isAdmin = HasAccess("admin") || HasAccess("super-admin");
  const isSeller = HasAccess("seller");
  const isCustomer = HasAccess("customer");
  const displayName =
    user?.name || user?.businessName || user?.email || "My account";

  const handleSignOut = () => {
    dispatch(setLogOut());
    router.push("/");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <AiOutlineUser />,
      label: "Profile",
      onClick: () => {
        if (isAdmin) router.push("/admin/profile");
        else if (isSeller) router.push("/seller/profile");
        else if (isCustomer) router.push("/customer/profile");
        else router.push("/profile");
      },
    },
    { key: "dashboard", icon: <AiOutlineShop />, label: isAdmin ? "Dashboard" : isSeller ? "Dealer Dashboard" : "My Dashboard", onClick: () => router.push(isAdmin ? "/admin" : isSeller ? "/seller" : "/customer") },
    { key: "settings", icon: <AiOutlineSetting />, label: "Settings", onClick: () => router.push(isAdmin ? "/admin/settings" : isSeller ? "/seller/settings" : "/profile/settings") },
    ...(isCustomer || isSeller
      ? [{ key: "watchlist", icon: <AiOutlineEye />, label: "Wishlist", onClick: () => router.push("/wishlist") }]
      : []),
    { type: "divider" },
    { key: "signout", icon: <AiOutlineLogout />, label: "Sign Out", onClick: handleSignOut },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
      <Tooltip title={displayName} placement="bottom" mouseEnterDelay={0.2}>
        <div className="cursor-pointer transition-transform duration-200 hover:scale-110">
          <Avatar
            src={user?.profilePhoto ? getMediaUrl(user.profilePhoto) : undefined}
            icon={!user?.profilePhoto ? <AiOutlineUser /> : undefined}
            className="border-2 border-blue-500 w-10 h-10 min-w-[27px] min-h-[27px] max-w-[35px] max-h-[35px]"
          />
        </div>
      </Tooltip>
    </Dropdown>
  );
};

export default ProfileDropdown;
