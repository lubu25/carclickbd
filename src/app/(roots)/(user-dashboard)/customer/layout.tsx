"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { IDNavMenuItem } from "@/Interface/content";
import { getTokenInfo } from "@/service/auth.service";
import { getMenuContent } from "@/content/DNavigationMenu";
import Container from "@/shared/wrapper/Container";
import LeftSidebar from "../components/leftSidebar";
import RouteGuard from "@/shared/wrapper/RouteGuard";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const layoutState = useAppSelector(
    (state) => state.layoutReducer.layoutState
  );
  const tokenInfo = getTokenInfo();

  const navigationRoutes = getMenuContent(tokenInfo, dispatch);

  return (
    <RouteGuard>
      <Container>
        <div className="relative flex h-screen min-w-0 overflow-hidden">
          <aside className={`${layoutState && "md:hidden"}`}>
            <LeftSidebar
              menuGroups={navigationRoutes as unknown as IDNavMenuItem[]}
            />
          </aside>
          <section className="h-full min-w-0 flex-1 overflow-hidden">
            <main className="h-[calc(100vh-55px)] min-w-0 overflow-x-auto overflow-y-auto">
              {children}
            </main>
          </section>
        </div>
      </Container>
    </RouteGuard>
  );
};

export default DashBoardLayout;
