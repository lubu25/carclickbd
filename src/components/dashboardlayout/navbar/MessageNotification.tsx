import { INotificationMessage } from "@/Interface/content";
import Image from "next/image";
import React from "react";

import { CiClock2 } from "react-icons/ci";

const MessageNotification: React.FC<{ notification: INotificationMessage }> = ({
  notification,
}) => {
  return (
    <div className="flex gap-2  px-4 py-2 rounded mt-1 w-full hover:bg-slate-50 ">
      <div className="rounded-full h-10 w-10 overflow-hidden">
        <Image
          src={notification.user.photo}
          className="w-full"
          width={100}
          height={100}
          alt="user avatar"
        />
      </div>
      <div>
        <h2 className="font-bold text-[14px]">{notification.user.name}</h2>
        <p className="text-gray-600 text-md  ">{notification.lastMessage}</p>
        <span className="text-gray-800 flex items-center gap-1 text-xs mt-1">
          <span>
            <CiClock2 />
          </span>
          <span className="  font-semibold tracking-wider ">
            {notification.time}
          </span>
        </span>
      </div>
    </div>
  );
};

export default MessageNotification;
