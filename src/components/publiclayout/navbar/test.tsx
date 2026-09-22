// "use client";

// import {React, use, useEffect} from "react";
// import { Dropdown, Avatar, MenuProps } from "antd";
// import { useRouter } from "next/navigation";
// import {
//   AiOutlineUser,
//   AiOutlineEye,
//   AiOutlineShop,
//   AiOutlineSetting,
//   AiOutlineLogout,
// } from "react-icons/ai";
// import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
// import { setLogOut } from "@/Redux/Slices/authSlice";
// import HasAccess from "@/routes/RoleBasedRouteGenerator";

// const isCustomer = HasAccess("customer");



// const ProfileDropdown: React.FC = () => {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((state) => state.authReducer.profile);

//   const handleSignOut = () => {
//     dispatch(setLogOut());
//     router.push("/");
//   };

//   const menuItems: MenuProps["items"] = [
//     {
//       key: "profile",
//       icon: <AiOutlineUser />,
//       label: "Profile",
//       onClick: () =>
//         router.push(`${isCustomer ? "/profile" : "/admin/profile"}`),
//     },
//     ...(isCustomer
//       ? [
//           {
//             key: "watchlist",
//             icon: <AiOutlineEye />,
//             label: "Watch List",
//             onClick: () => router.push("/watch-list"),
//           },
//         ]
//       : []),
//     {
//       key: "dashboard",
//       icon: <AiOutlineShop />,
//       label: `${isCustomer ? "Seller Dashboard" : "Dashboard"}`,
//       onClick: () => router.push(`${isCustomer ? "/customer" : "/admin"}`),
//     },
//     {
//       key: "settings",
//       icon: <AiOutlineSetting />,
//       label: "Settings",
//       onClick: () =>
//         router.push(`${isCustomer ? "/profile/setting" : "/admin/profile"}`),
//     },
//     {
//       type: "divider",
//     },
//     {
//       key: "signout",
//       icon: <AiOutlineLogout />,
//       label: "Sign Out",
//       onClick: () => handleSignOut(),
//     },
//   ];

//   useEffect(() => {
    
//   }, [isCustomer]);
//   return (
//     <div className="flex items-center space-x-3">
//       <Dropdown
//         menu={{
//           items: menuItems,
//         }}
//         trigger={["click"]}
//         placement="bottomRight"
//       >
//         <div
//           style={{
//             display: "inline-block",
//             transition: "transform 0.2s",
//             cursor: "pointer",
//           }}
//           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
//           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           <Avatar
//             src={
//               user?.profilePhoto ||
//               "https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
//             }
//             style={{
//               border: "2px solid #1890ff",
//               width: "5vw",
//               height: "5vw",
//               maxWidth: "35px",
//               maxHeight: "35px",
//               minWidth: "27px",
//               minHeight: "27px",
//             }}
//           />
//         </div>
//       </Dropdown>
//     </div>
//   );
// };

// export default ProfileDropdown;
