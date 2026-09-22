"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SidebarMenu from "./SidebarMenu";

export type Route = {
  name: string;
  icon: JSX.Element;
  url?: string;
  children?: Route[];
};

type SidebarProps = {
  routes: Route[];
};

const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (url: string) => {
    router.push(url);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={` 
            ${isMobileMenuOpen ? "fixed left-52 delay-300" : "absolute  left-3"} 
            h-12 z-50  rounded-lg bg-white p-3  pt-0 md:hidden hover:bg-gray-100 transition-colors `}
      >
        {isMobileMenuOpen ? "✕" : "☰"}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#fff] border-r border-gray-100 z-40 transition-transform duration-300 ease-in-out w-64 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-auto md:w-80`}
      >
        {/* Logo or Header */}
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-semibold">Menu</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <SidebarMenu routes={routes} handleNavigation={handleNavigation} />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
