"use client";

import { getMenuContent } from "@/content/DNavigationMenu";
import { getTokenInfo } from "@/service/auth.service";
import Link from "next/link";
import NavBottomDropdown from "./DNavBottomDropdown";
import { useAppDispatch, } from "@/Redux/hooks";

// Helper function to get appropriate menu content based on user info

const DNavBottomSection = () => {
    const dispatch = useAppDispatch();
  const tokenInfo = getTokenInfo();
  const menuContent = getMenuContent(tokenInfo, dispatch);

  return (
    <div className="w-full border-b border-gray-400 ">
      <div className="container mx-auto h-12 py-2 shadow-xl text-sm lg:text-base flex items-center md:justify-center lg:justify-start gap-3 lg:gap-10 ">
        {menuContent.map((menu, index) => (
          <div className="z-[999999]" key={index}>
            {menu.children ? (
              <NavBottomDropdown
                icon={menu.icon}
                label={menu.label}
                // eslint-disable-next-line react/no-children-prop
                children={menu.children as []}
              />
            ) : (
              <Link
                className="flex items-center gap-1"
                href={menu.route as string}
              >
                {menu?.icon}
                {menu?.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DNavBottomSection;
