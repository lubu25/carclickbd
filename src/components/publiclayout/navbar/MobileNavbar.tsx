"use client";
import React, { useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import Logo from "@/components/shared/Logo";
import { useAppSelector } from "@/Redux/hooks";
import ProfileDropdown from "./ProfileDropdown";
import NavAuth from "./NavAuth";
import { Drawer } from "antd";
import NavSearchBar from "./NavSearchBar";
import NavMenu from "./NavMenu";

const MobileNavbar = () => {

  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex py-5 items-center justify-between w-full relative">
      <Logo />
      <div className="flex items-center gap-3 ">
        <NavSearchBar />
        {isLoggedIn ? (
          <ProfileDropdown />
        ) : (
          <NavAuth />
        )}

        <button
          onClick={toggleMenu}
          className="text-2xl hover:text-primary transition-colors duration-300"
          aria-label="Toggle mobile menu"
        >
          <CiMenuFries />
        </button>
      </div>

      <Drawer
        width={300}
        title={
          <h2 className="font-bold text-md ">
            <span className="border-l-8 rounded border-primary pl-1 ml-8  overflow-hidden"></span>{" "}
            <span>Menu</span>
          </h2>
        }
        onClose={toggleMenu}
        visible={isMenuOpen}
      >
        <NavMenu/>
      </Drawer>
    </nav>
  );
};

export default MobileNavbar;
