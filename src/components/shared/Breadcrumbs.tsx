"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>,
    },
    ...pathSegments.map((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      return {
        title: <Link href={href}>{decodeURIComponent(segment)}</Link>,
      };
    }),
  ];

  return <Breadcrumb items={breadcrumbItems} className="mb-4" />;
}
