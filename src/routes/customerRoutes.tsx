import { IDNavMenuItem } from "@/Interface/content";
import {
  CarOutlined,
  CommentOutlined,
  DashboardOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { BiPurchaseTag } from "react-icons/bi";

const customerRoutes: IDNavMenuItem[] = [
  { icon: <DashboardOutlined />, label: "Dashboard", route: "/customer" },
  { icon: <UserOutlined />, label: "Profile", route: "/customer/profile" },
  { icon: <CarOutlined />, label: "Browse Cars", route: "/cars" },
  {
    icon: <CommentOutlined />,
    label: "Inquiries",
    children: [
      { label: "My Inquiries", route: "/customer/bids" },
      { label: "Inquiry Archive", route: "/customer/bids/past-auction" },
    ],
  },
  {
    icon: <HeartOutlined />,
    label: "Saved & Cart",
    children: [
      { label: "Saved Cars", route: "/customer/cart" },
      { label: "Cart", route: "/customer/cart" },
    ],
  },
  { icon: <BiPurchaseTag />, label: "Orders", route: "/customer/order" },
];

export { customerRoutes };
