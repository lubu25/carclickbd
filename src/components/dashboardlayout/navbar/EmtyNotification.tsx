import Image from "next/image";
import React from "react";

const EmtyNotifications = () => {
  return (
    <div className="flex flex-col justify-center items-center p-5  ">
      
      <h2 className="font-bold text-xl mt-2 text-center text-gray-600  ">
        Hey! You have no any notifications.
      </h2>
    </div>
  );
};

export default EmtyNotifications;
