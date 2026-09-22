"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/Redux/hooks";
import Logo from "@/components/shared/Logo";
import NavSearchBar from "./NavSearchBar";
import NavMenu from "./NavMenu";

const ProfileDropdown = dynamic(() => import("./ProfileDropdown"), { ssr: false });
const NavAuth = dynamic(() => import("./NavAuth"), { ssr: false });

const DeskTopNavbar = () => {
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  if (isLoggedIn === undefined) return null;

  return (
    <nav className="top-0 left-0 z-50 bg-white shadow-md w-full px-4 lg:px-6 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Logo />
        <NavMenu />
        <NavSearchBar />
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <ProfileDropdown />
          ) : (
            <NavAuth />
          )}
        </div>
      </div>
    </nav>
  );
};

export default DeskTopNavbar;
