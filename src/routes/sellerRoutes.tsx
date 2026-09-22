import { IDNavMenuItem } from "@/Interface/content";
import {
  DashboardOutlined,
  FileTextOutlined,
  ShopOutlined,
  StarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BiPurchaseTag } from "react-icons/bi";

const sellerRoutes: IDNavMenuItem[] = [
  { icon: <DashboardOutlined />, label: "Seller Dashboard", route: "/seller" },
  { icon: <UserOutlined />, label: "Profile", route: "/seller/profile" },
  {
    icon: <ShopOutlined />,
    label: "Listings",
    children: [
      { label: "My Listings", route: "/seller/my-product" },
      { label: "Create Listing", route: "/seller/my-product/create-product" },
      { label: "Pending Approval", route: "/seller/my-product/disable-product" },
    ],
  },
  { icon: <StarOutlined />, label: "Featured Requests", route: "/seller/featured-requests" },
  { icon: <BiPurchaseTag />, label: "Orders", route: "/seller/order" },
  {
    icon: <FileTextOutlined />,
    label: "Reports",
    children: [
      { label: "Selling Report", route: "/seller/report/selling" },
      { label: "Earning Report", route: "/seller/report/earning" },
    ],
  },
];

export { sellerRoutes };
