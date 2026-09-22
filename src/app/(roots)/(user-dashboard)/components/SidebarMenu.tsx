import React, { useState } from "react";
import { Route } from "./Sidebar";

type SidebarMenuProps = {
  routes: Route[];
  handleNavigation: (url: string) => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  routes,
  handleNavigation,
}) => {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <ul className="space-y-2">
      {routes.map((route) => {
        const isOpen = openMenus.includes(route.name);

        return (
          <li key={route.name} className="text-gray-700">
            <div
              onClick={() =>
                route.url ? handleNavigation(route.url) : toggleMenu(route.name)
              }
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 active:bg-gray-200 ${
                route.children && isOpen ? "bg-gray-50" : ""
              }`}
            >
              <span className="text-gray-500">{route.icon}</span>
              <span className="flex-1 text-sm font-medium">{route.name}</span>
              {route.children && (
                <span
                  className={`text-xs transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              )}
            </div>

            {/* Dropdown Menu with Smooth Slide Effect */}
            <div
              className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-40" : "max-h-0"
              }`}
            >
              <ul className="mt-2 ml-4 pl-4 border-l border-gray-200 space-y-2">
                {route.children?.map((child) => (
                  <li key={child.name}>
                    <div
                      onClick={() => handleNavigation(child.url || "")}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-500 active:bg-gray-200"
                    >
                      <span className="text-gray-500 ">{child.icon}</span>
                      <span className="text-sm">{child.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarMenu;
