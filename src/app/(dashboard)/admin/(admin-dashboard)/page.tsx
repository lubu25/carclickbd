"use client";

import AdminBoardHome from "@/components/dashboardlayout/adminBoardHome/Page";
import SellerBoardHome from "@/components/dashboardlayout/sellerBoardHome/Page";
import AdminProtect from "@/components/shared/protectors/AdminProtect";
import { getTokenInfo } from "@/service/auth.service";
import React from "react";

const HomePage = () => {
  const tokenInfo = getTokenInfo();
  const isSeller = tokenInfo?.role === "seller";

  return (
    <AdminProtect>
      {isSeller ? <SellerBoardHome /> : <AdminBoardHome />}
    </AdminProtect>
  );
};

export default HomePage;
