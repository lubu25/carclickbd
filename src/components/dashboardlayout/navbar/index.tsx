"use client";
import { useAppSelector } from "@/Redux/hooks";
import NavTopSection from "./DNavTopSection";
import DNavBottomSection from "./DNavBottomSection";
import { useEffect, useState } from "react";

const DashBoardNav = () => {
  const [isClient, setIsClient] = useState(false);
  const layoutState = useAppSelector(
    (state) => state.layoutReducer.layoutState,
  );

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }
  return (
    <div>
      <section>
        <NavTopSection />
      </section>
      <section className={`${!layoutState && "md:hidden"} hidden md:block   `}>
        <DNavBottomSection />
      </section>
    </div>
  );
};

export default DashBoardNav;
