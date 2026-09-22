import React from "react";
import AuctionProducts from "@/components/product/AuctionProducts";
import HeaderSlider from "./HeaderSlider";
import RegisterBanner from "./RegisterBanner";
import FollowUs from "./FollowUs";
import AuctionSheetVerification from "./AuctionSheetVerification";

const LandingHomePage = () => {
  return (
    <main className="bg-slate-50">
      <HeaderSlider />

      <AuctionProducts isShowAll={false} isPaginate={false} isDraft={false} isWinner={false} />

      <div className="border-y border-slate-200 bg-white">
        <AuctionSheetVerification />
      </div>

      <FollowUs />
      <RegisterBanner />
      {/* <NewsletterSection /> */}
    </main>
  );
};

export default LandingHomePage;
