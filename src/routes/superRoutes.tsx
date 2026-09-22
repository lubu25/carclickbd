import { IDNavMenuItem } from "@/Interface/content";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CustomerServiceOutlined,
  DashboardOutlined,
  FileTextOutlined,
  MailOutlined,
  NotificationOutlined,
  SafetyOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BiPurchaseTag } from "react-icons/bi";

const superRoutes: IDNavMenuItem[] = [
  { icon: <DashboardOutlined />, label: "Dashboard", route: "/admin" },
  { icon: <UserOutlined />, label: "Profile", route: "/admin/profile" },
  {
    icon: <SafetyOutlined />,
    label: "Admin Users",
    children: [
      { label: "All Admins", route: "/admin/admins" },
      { label: "Create Admin", route: "/admin/admins/create-admin" },
    ],
  },
  {
    icon: <ShopOutlined />,
    label: "Listings",
    children: [
      { label: "All Listings", route: "/admin/product" },
      { label: "Create Listing", route: "/admin/product/create-product" },
      { label: "Pending Approval", route: "/admin/product/disable-product" },
      { label: "My Listings", route: "/admin/my-product" },
    ],
  },
  {
    icon: <TeamOutlined />,
    label: "Sellers",
    children: [
      { label: "All Sellers", route: "/admin/seller" },
      { label: "Create Seller", route: "/admin/seller/create-seller" },
    ],
  },
  {
    icon: <TeamOutlined />,
    label: "Customers",
    children: [
      { label: "All Customers", route: "/admin/user" },
      { label: "Create Customer", route: "/admin/user/create-customer" },
    ],
  },
  { icon: <FileTextOutlined />, label: "Inquiries", route: "/admin/comment-history" },
  {
    icon: <BiPurchaseTag />,
    label: "Sales & Inventory",
    children: [
      { label: "Orders", route: "/admin/order" },
      { label: "Refunds", route: "/admin/refund" },
      { label: "Stock", route: "/admin/stock" },
    ],
  },
  { icon: <AppstoreOutlined />, label: "Vehicle Categories", route: "/admin/category" },
  {
    icon: <NotificationOutlined />,
    label: "Marketing",
    children: [
      { label: "Promo Offers", route: "/admin/offer" },
      { label: "Flash Deals", route: "/admin/marketing/flash-deals" },
      { label: "Dynamic Pop-up", route: "/admin/marketing/dynamic-pop-up" },
      { label: "Custom Alerts", route: "/admin/custom-alerts" },
      { label: "Newsletter", route: "/admin/newsletter" },
      { label: "Email Templates", route: "/admin/email-template" },
      { label: "Bulk SMS", route: "/admin/bulk-sms" },
      { label: "Notifications", route: "/admin/notification" },
    ],
  },
  {
    icon: <FileTextOutlined />,
    label: "Content",
    children: [
      { label: "Header Slider", route: "/admin/header-carousel" },
      { label: "Website Content", route: "/admin/web-content" },
    ],
  },
  {
    icon: <BarChartOutlined />,
    label: "Reports",
    children: [
      { label: "Selling Report", route: "/admin/report/selling" },
      { label: "Earning Report", route: "/admin/report/earning" },
    ],
  },
  { icon: <MailOutlined />, label: "Mailbox", route: "/admin/mailbox" },
  { icon: <CustomerServiceOutlined />, label: "Support", route: "/admin/support" },
  { icon: <SettingOutlined />, label: "Settings", route: "/admin/settings" },
];

export { superRoutes };
