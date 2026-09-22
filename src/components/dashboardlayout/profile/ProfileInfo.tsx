import React from "react";
import { Card, Typography } from "antd";
import UpdateContactNo from "./UpdateContentNo";
import UpdateName from "./UpdateName";
import UpdateAddress from "./ModifyAddress";
import { IUser } from "@/Interface/user";
import { formatDate } from "@/components/shared/custom/FormatDate";

const { Title, Text } = Typography;

const ProfileInfo: React.FC<{ user: IUser }> = ({ user }) => {
  return (
    <Card className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <Title level={3} className="!mb-6 !text-slate-950">
        Profile Information
      </Title>
      <div className="space-y-5">
        {[
          { label: "Name", value: user?.name, Component: UpdateName },
          { label: "Email", value: user?.email || "N/A" },
          { label: "Address", value: user?.address || "N/A", Component: UpdateAddress },
          { label: "Contact", value: user?.contactNo, Component: UpdateContactNo },
          { label: "Role", value: user?.role },
          { label: "Joining Date", value: formatDate(user?.updatedAt as string) },
        ].map(({ label, value, Component }, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <Text className="text-sm font-bold uppercase tracking-wide text-slate-400">
              {label}
            </Text>
            <div className="flex items-center gap-3">
              <Text className="break-words text-sm font-bold text-slate-900">
                {value}
              </Text>
              {Component && <Component />}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProfileInfo;
