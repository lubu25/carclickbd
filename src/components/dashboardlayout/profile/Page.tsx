"use client";

import { useEffect, useState } from "react";
import { MailOutlined, PhoneOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import { IUser } from "@/Interface/user";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { useConvertToSellerMutation } from "@/Redux/api/userApi";
import { setIsLoggedIn, setProfileInfo } from "@/Redux/Slices/authSlice";
import { useRouter } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ProfilePictureUploader from "./ProfilePictureUploader";

const ProfileComponentPage = () => {
  const profileInfo = useAppSelector((state) => state.authReducer.profile);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [convertToSeller, { isLoading: isConverting }] = useConvertToSellerMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !profileInfo) {
    return null;
  }

  const contactItems = [
    {
      label: "Email",
      value: profileInfo.email || "N/A",
      icon: MailOutlined,
    },
    {
      label: "Contact",
      value: profileInfo.whatsappNumber || profileInfo.contactNo || "N/A",
      icon: PhoneOutlined,
    },
    {
      label: "Role",
      value: profileInfo.role || "N/A",
      icon: ShopOutlined,
    },
  ];

  const handleConvertToPersonalSeller = () => {
    Modal.confirm({
      title: "Convert to personal seller?",
      content: "Your customer account will become a personal seller account.",
      okText: "Convert",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await convertToSeller().unwrap();
          const accessToken = response?.data?.accessToken;
          const user = response?.data?.user;

          if (!accessToken || !user) {
            message.error("Unable to convert account.");
            return;
          }

          dispatch(setIsLoggedIn(accessToken));
          dispatch(setProfileInfo(user));
          message.success(response?.message || "Account converted successfully.");
          router.push("/seller");
        } catch (error: any) {
          message.error(error?.data?.message || error?.message || "Failed to convert account.");
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="relative bg-gradient-to-r from-slate-950 via-[#08245d] to-[#003399] px-6 py-8 text-white md:px-8">
          <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <ProfilePictureUploader user={profileInfo as IUser} compact />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f0b90b]">
                  {profileInfo.role === "customer" ? "Customer Profile" : "Seller Profile"}
                </p>
                <h1 className="mt-2 text-2xl font-black md:text-3xl">
                  {profileInfo.name || profileInfo.businessName || "User"}
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {profileInfo.email || "No email available"}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur">
              Profile picture upload is available from the avatar.
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-3 md:p-6">
          {contactItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-white text-[#003399] shadow-sm">
                  <Icon />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 break-words text-sm font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_320px]">
        <ProfileInfo user={profileInfo as IUser} />

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-lg text-[#003399] ring-1 ring-sky-100">
            <UserOutlined />
          </div>
          <h2 className="text-lg font-black text-slate-950">Account Care</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep your profile updated so buyers and admins can identify
            your account quickly.
          </p>
          {profileInfo.role === "customer" && (
            <Button
              type="primary"
              loading={isConverting}
              onClick={handleConvertToPersonalSeller}
              className="mt-4 !w-full !rounded-lg !border-[#e50914] !bg-[#e50914] !font-bold !text-white hover:!bg-[#b80f17]"
            >
              Convert to Personal Seller
            </Button>
          )}
          <div className="mt-4">
            <ProfilePictureUploader
              user={profileInfo as IUser}
              triggerButtonTitle="Upload Profile Picture"
            />
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ProfileComponentPage;
