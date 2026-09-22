"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { CiSettings } from "react-icons/ci";
import { IDNavMenuItem } from "@/Interface/content";
import { toggleLayoutSidebar } from "@/Redux/Slices/dashboardLayout/layoutSlice";
import LeftSidebar from "@/components/dashboardlayout/sidebar/leftSidebar";
import DashBoardNav from "@/components/dashboardlayout/navbar";
import RightSidebar from "@/components/dashboardlayout/sidebar/rightSidebar";
import { getMenuContent } from "@/content/DNavigationMenu";
import RouteGuard from "@/shared/wrapper/RouteGuard";
import { getTokenInfo } from "@/service/auth.service";

const SellerLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const layoutState = useAppSelector((state) => state.layoutReducer.layoutState);
  const tokenInfo = getTokenInfo();
  const navigationRoutes = getMenuContent(tokenInfo, dispatch);

  return (
    <RouteGuard>
      <div className="relative flex h-screen min-w-0 overflow-hidden bg-slate-100">
        <aside className={`${layoutState && "md:hidden"}`}>
          <LeftSidebar menuGroups={navigationRoutes as unknown as IDNavMenuItem[]} />
        </aside>
        <section className="h-full min-w-0 flex-1 overflow-hidden">
          <header>
            <DashBoardNav />
          </header>
          <main className="h-[calc(100vh-55px)] min-w-0 overflow-x-auto overflow-y-auto bg-slate-100 p-3 md:p-5">
            <div className="absolute bottom-10 right-10 z-[999999999] hidden h-12 w-12 items-center justify-center rounded-full bg-[#003399] md:flex">
              <button
                onClick={() => dispatch(toggleLayoutSidebar(true))}
                className="animate-spin text-3xl text-white"
              >
                <CiSettings />
              </button>
            </div>
            {children}
          </main>
        </section>
        <aside className="hidden overflow-hidden md:block">
          <RightSidebar />
        </aside>
      </div>
    </RouteGuard>
  );
};

export default SellerLayout;
