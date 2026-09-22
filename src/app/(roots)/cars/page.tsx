"use client";
import AuctionProducts from "@/components/product/AuctionProducts";
import CarsSearchSection from "@/components/publiclayout/home/AcutionProducts/CarsSearchSection";

const CarsPage = () => {
  return (
    <main className="bg-slate-50 pb-12">
      <CarsSearchSection />
      <div className="container mx-auto px-4 sm:px-5 lg:px-0">
        <AuctionProducts isShowAll isPaginate isDraft={false} />
      </div>
    </main>
  );
};

export default CarsPage;
