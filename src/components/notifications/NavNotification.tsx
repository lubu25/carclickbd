"use client";

import Link from "next/link";
import { Tooltip } from "antd";
import { CarFront, ClipboardList, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import type React from "react";
import { useGetNotificationsQuery } from "@/Redux/api/notificationApi";
import { getTokenInfo } from "@/service/auth.service";
import { INotification } from "@/Interface/notification";

const asNotificationArray = (value: unknown): INotification[] =>
  Array.isArray(value) ? value : [];

const getNotificationCategory = (notification: INotification) => {
  const message = (notification?.message || "").toLowerCase();

  if (message.includes("inquiry")) return "inquiries";
  if (
    message.includes("new listing") ||
    message.includes("listing added") ||
    message.includes("product") ||
    message.includes("vehicle")
  ) {
    return "products";
  }

  return "messages";
};

const getRoleBasePath = (role?: string) => {
  if (role === "super-admin" || role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  if (role === "customer") return "/customer";
  return "/customer";
};

const NotificationShortcut = ({
  href,
  label,
  count,
  icon,
  tone,
}: {
  href: string;
  label: string;
  count: number;
  icon: React.ReactNode;
  tone: "blue" | "emerald" | "amber";
}) => {
  const toneClasses = {
    blue: "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-500/10",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-500/10",
    amber: "border-[#f5bd05]/40 bg-[#fff8df] text-slate-950 shadow-[#f5bd05]/10",
  };

  return (
    <Tooltip title={label}>
      <Link
        href={href}
        aria-label={label}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${toneClasses[tone]}`}
      >
        {icon}
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black leading-none text-white ring-2 ring-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Tooltip>
  );
};

const NotificationDropdown: React.FC = () => {
  const { data: response } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });
  const notifications = asNotificationArray(response);
  const user = useMemo(() => getTokenInfo(), []);
  const basePath = getRoleBasePath(user?.role);

  const unreadCounts = notifications.reduce(
    (counts, notification) => {
      if (notification?.isRead) return counts;
      const category = getNotificationCategory(notification);
      counts[category] += 1;
      return counts;
    },
    { messages: 0, inquiries: 0, products: 0 },
  );

  return (
    <div className="flex items-center gap-2">
      <NotificationShortcut
        href={`${basePath}/messages`}
        label="Messages"
        count={unreadCounts.messages}
        icon={<MessageCircle size={18} strokeWidth={2.4} />}
        tone="blue"
      />
      <NotificationShortcut
        href={`${basePath}/inquiries`}
        label="Inquiries"
        count={unreadCounts.inquiries}
        icon={<ClipboardList size={18} strokeWidth={2.4} />}
        tone="emerald"
      />
      <NotificationShortcut
        href={`${basePath}/product-notifications`}
        label="Product add notifications"
        count={unreadCounts.products}
        icon={<CarFront size={18} strokeWidth={2.4} />}
        tone="amber"
      />
    </div>
  );
};

export default NotificationDropdown;
