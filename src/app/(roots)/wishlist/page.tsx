"use client";

import Link from "next/link";
import { Button } from "antd";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/publiclayout/home/AcutionProducts/ProductCard";
import { IProduct } from "@/Interface/product";
import { useAppSelector } from "@/Redux/hooks";
import { useGetUserWatchListQuery } from "@/Redux/features/watch-list/watchlistApi";
import CardSkeleton from "@/shared/skeleton/CardSkeleton";
import NoDatafound from "@/shared/ui/NoDatafound";
import {
  getLocalWishlist,
  getWishlistUserKey,
  LOCAL_WISHLIST_UPDATED_EVENT,
} from "@/utils/localWishlist";

const WishlistPage = () => {
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const profile = useAppSelector((state) => state.authReducer.profile);
  const wishlistUserKey = getWishlistUserKey(profile || undefined);
  const [localProducts, setLocalProducts] = useState<IProduct[]>([]);
  const { data, isLoading } = useGetUserWatchListQuery([], {
    skip: !isLoggedIn || profile?.role === "seller",
  });

  const apiProducts: IProduct[] = (data?.data || [])
    .map((item: any) => item?.product)
    .filter(Boolean);
  const watchlistProducts: IProduct[] = [
    ...apiProducts,
    ...localProducts.filter(
      (localProduct) =>
        !apiProducts.some((apiProduct) => apiProduct._id === localProduct._id),
    ),
  ];

  useEffect(() => {
    const updateLocalProducts = () => {
      setLocalProducts(getLocalWishlist(wishlistUserKey));
    };

    updateLocalProducts();
    window.addEventListener(LOCAL_WISHLIST_UPDATED_EVENT, updateLocalProducts);
    window.addEventListener("storage", updateLocalProducts);

    return () => {
      window.removeEventListener(
        LOCAL_WISHLIST_UPDATED_EVENT,
        updateLocalProducts,
      );
      window.removeEventListener("storage", updateLocalProducts);
    };
  }, [wishlistUserKey]);

  return (
    <main className="bg-slate-50">
      <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-600 shadow-sm">
              <Heart size={16} fill="currentColor" />
              Wishlist
            </div>
            <h1 className="text-3xl font-black text-slate-950 md:text-4xl">
              Saved Cars
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600 md:text-base">
              Review the vehicles you have saved and open the details when you
              are ready to inquire.
            </p>
          </div>

          <Link href="/cars">
            <Button size="large" className="font-semibold">
              Browse Cars
            </Button>
          </Link>
        </div>

        {!isLoggedIn ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
            <Heart
              size={42}
              className="mx-auto mb-4 text-rose-500"
              fill="currentColor"
            />
            <h2 className="text-2xl font-bold text-slate-950">
              Sign in to view your wishlist
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Your saved cars are linked with your account, so please sign in to
              see all wishlist items.
            </p>
            <Link href="/login">
              <Button type="primary" size="large" className="mt-5">
                Sign In
              </Button>
            </Link>
          </div>
        ) : isLoading && !localProducts.length ? (
          <CardSkeleton />
        ) : watchlistProducts.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {watchlistProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <NoDatafound />
        )}
      </section>
    </main>
  );
};

export default WishlistPage;
