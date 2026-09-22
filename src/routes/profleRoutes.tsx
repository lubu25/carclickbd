import { SettingFilled, UserOutlined } from "@ant-design/icons";

export const profileRoutes = [
  {
    name: "Profile",
    icon: <UserOutlined />,
    url: "/profile",
  },
  {
    name: "Settings",
    icon: <SettingFilled />,
    url: "/profile/setting",
  },
];
