// Types
interface DropdownLink {
  label: string;
  href: string;
  icon?: React.ReactNode; 
}
import { FaUserCircle } from "react-icons/fa";
import {
  MdOutlineManageAccounts,
  MdOutlineManageHistory,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

export const userDropdownWithoutLoggedInLinks: DropdownLink[] = [
  { label: "Sign In", href: "/auth/signin" },
  { label: "Sign Up", href: "/auth/signup" },
  { label: "Forgot Account", href: "/auth/forget-account" },
];

export const adminDropdownWithLoggedInLinks: DropdownLink[] = [
  { label: "Profile", href: "/admin/profile", icon: <FaUserCircle /> },
  {
    label: "Account History",
    href: "/account/history",
    icon: <MdOutlineManageHistory />,
  },
  {
    label: "Dashboard",
    href: `/admin`,
    icon: <RxDashboard />,
  },
  {
    label: "Settings",
    href: "/account/setting",
    icon: <MdOutlineManageAccounts />,
  },
];

export const businessDropdownWithLoggedInLinks: DropdownLink[] = [
  { label: "Profile", href: "/business/profile", icon: <FaUserCircle /> },
  {
    label: "Account History",
    href: "/account/history",
  },
  {
    label: "Dashboard",
    href: `/business`,
    icon: <RxDashboard />,
  },
  {
    label: "Settings",
    href: "/account/setting",
    icon: <MdOutlineManageAccounts />,
  },
];

export const personalDropdownWithLoggedInLinks: DropdownLink[] = [
  {
    label: "Profile",
    href: "/personal/profile",
    icon: <FaUserCircle />,
  },

  {
    label: "Dashboard",
    href: `/personal`,
    icon: <RxDashboard />,
  },
];

export const getMenuContent = (tokenInfo: any) => {
  if (tokenInfo?.role === "admin" || tokenInfo?.role === "super_admin") {
    return adminDropdownWithLoggedInLinks;
  }
  if (tokenInfo?.accountType === "business") {
    return businessDropdownWithLoggedInLinks;
  }
  if (tokenInfo?.accountType === "personal") {
    return personalDropdownWithLoggedInLinks;
  }
  return [];
};
