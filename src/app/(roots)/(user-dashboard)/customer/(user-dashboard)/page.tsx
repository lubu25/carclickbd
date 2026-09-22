"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRightOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Spin } from "antd";
import { useAppSelector } from "@/Redux/hooks";
import { useGetMyOrdersQuery } from "@/Redux/api/orderApi";
import { useGetMyCommentsQuery } from "@/Redux/features/comment/commentApi";
import { useGetAllMyBidsQuery } from "@/Redux/features/bids/myBidApi";
import { useGetUserWatchListQuery } from "@/Redux/features/watch-list/watchlistApi";

const getList = (response: any) => {
  const data = response?.data ?? response?.orders ?? response;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders?.data)) return data.orders.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.watchlist)) return data.watchlist;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const getDate = (item: any) =>
  new Date(item?.createdAt || item?.updatedAt || 0).getTime();

const UserDashboard = () => {
  const profile = useAppSelector((state) => state.authReducer.profile);
  const [cartCount, setCartCount] = useState(0);

  const { data: orderResponse, isLoading: ordersLoading } = useGetMyOrdersQuery({});
  const { data: commentResponse, isLoading: commentsLoading } = useGetMyCommentsQuery({});
  const { data: bidResponse, isLoading: bidsLoading } = useGetAllMyBidsQuery([]);
  const { data: watchlistResponse, isLoading: watchlistLoading } =
    useGetUserWatchListQuery([]);

  const orders = getList(orderResponse);
  const comments = getList(commentResponse);
  const bids = getList(bidResponse);
  const savedCars = getList(watchlistResponse);
  const isLoading = ordersLoading || commentsLoading || bidsLoading || watchlistLoading;

  const wonItems = bids.filter((bid: any) => bid?.isWinner || bid?.status === "won");
  const recentActivity = [...comments, ...orders, ...savedCars]
    .sort((a, b) => getDate(b) - getDate(a))
    .slice(0, 4);

  const stats = [
    {
      title: "Saved Cars",
      value: savedCars.length,
      icon: HeartOutlined,
      href: "/customer/cart",
    },
    {
      title: "Inquiries",
      value: comments.length,
      icon: CommentOutlined,
      href: "/customer/bids",
    },
    {
      title: "Orders",
      value: orders.length,
      icon: ShoppingCartOutlined,
      href: "/customer/order",
    },
    {
      title: "Vehicle Inquiries",
      value: bids.length,
      icon: CarOutlined,
      href: "/customer/win-auction",
    },
    {
      title: "Shortlisted Deals",
      value: wonItems.length,
      icon: CheckCircleOutlined,
      href: "/customer/win-auction",
    },
    {
      title: "Cart",
      value: cartCount,
      icon: ShoppingCartOutlined,
      href: "/customer/cart",
    },
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem("addToCart");
    if (!savedCart) return;
    try {
      const parsedCart = JSON.parse(savedCart);
      setCartCount(Array.isArray(parsedCart) ? parsedCart.length : 0);
    } catch {
      setCartCount(0);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="grid min-h-[360px] place-items-center bg-slate-50 p-6">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 md:p-8">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#003399]">
          Buyer Dashboard
        </p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-950 md:text-3xl">
              Welcome back, {profile?.name || profile?.email || "Buyer"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track your saved cars, inquiries, orders, and buying activity from
              one simple panel. Empty data is shown as 0.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#e50914] px-5 text-sm font-black text-white transition hover:bg-[#b80f17]"
          >
            Browse Cars <ArrowRightOutlined />
          </Link>
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-lg text-[#003399] ring-1 ring-sky-100">
                <Icon />
              </div>
              <p className="text-sm font-bold text-slate-500">{item.title}</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {item.value}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Recent Activity
              </h2>
              <p className="text-sm text-slate-500">
                Latest real account activity.
              </p>
            </div>
          </div>

          {recentActivity.length ? (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((item: any, index: number) => (
                <div key={item?._id || index} className="py-4">
                  <p className="font-bold text-slate-900">
                    {item?.product?.title ||
                      item?.product?.model ||
                      item?.title ||
                      item?.orderNumber ||
                      "Account activity"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item?.comment ||
                      item?.message ||
                      item?.status ||
                      item?.createdAt ||
                      "Updated recently"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-lg font-black text-slate-950">
                0 recent activities
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Save a car or send an inquiry to see activity here.
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Quick Actions</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Find a car", "/cars"],
              ["View saved cars", "/customer/cart"],
              ["My inquiries", "/customer/bids"],
              ["My orders", "/customer/order"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-[#003399]"
              >
                {label}
                <ArrowRightOutlined />
              </Link>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
};

export default UserDashboard;
