"use client";
import { Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { MdRefresh } from "react-icons/md";

const RefreshFilter = ({ baseUrl = "/" }) => {
  const router = useRouter();
  return (
    <>
      <div
        onClick={() => router.push(`${baseUrl}`)}
        className="cursor-pointer"
      >
         <Tooltip title="Refrsh all filter" color="green">
          <MdRefresh className="size-6 font-semibold text-[gray]" />
        </Tooltip>
      </div>
    </>
  );
};

export default RefreshFilter;
