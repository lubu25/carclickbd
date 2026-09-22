"use client";
import Link from "next/link";
import { useState } from "react";
import Avatar from "@/components/shared/avatar";
import getProfileUrl from "@/content/getProfileUrl";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setLogOut } from "@/Redux/Slices/authSlice";
import { getTokenInfo } from "@/service/auth.service";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { getMediaUrl } from "@/utils/media";

const DNavProfile = () => {
  const [isOpen, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    // console.log('hello i am redicting')
    router.push("/");
    setOpen(false);
    dispatch(setLogOut());
  };
  const tokenInfo = getTokenInfo();
  // console.log(getProfileUrl(tokenInfo));

  const user = useAppSelector((state) => state.authReducer.profile);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!isOpen)}
        className=" mx-2 flex items-center justify-center gap-2  md:px-5 md:py-2    bg-slate-100 hover:bg-gray-300  "
      >
        <Avatar
          src={getMediaUrl(user?.profilePhoto)}
        />
        <div className="hidden md:block">
          <h2 className="font-semibold text-xs  ">{user?.name}</h2>
          <p className="text-xs text-gray-500 text-left  capitalize  ">
            {user?.role}
          </p>
        </div>
      </button>

      <div
        className={` absolute right-0 bg-white py-2 rounded-lg shadow-lg  w-[13rem]  transform transition-all duration-500 ease-in-out z-[99999999999] ${
          isOpen
            ? "translate-y-0 opacity-100 z-999999"
            : "translate-y-4 opacity-0 pointer-events-none"
        }   dark:text-white`}
      >
        <h3 className="font-semibold text-gray-500 p-4 text-xs">
          Welcome {user?.name}
        </h3>

        <div className="mt-5">
          <Link
            className="flex items-center gap-1 font-semibold   px-4 py-2 hover:bg-slate-100 text-gray-500 text-sm    hover:!text-blue-600"
            href={getProfileUrl(tokenInfo)}
          >
            <FaUserCircle /> Profile
          </Link>
        </div>

        <hr className="border-t my-3" />

        <div>
          <button
            onClick={handleLogOut}
            className="flex items-center gap-1 font-semibold   px-4 py-2 hover:bg-slate-100 text-gray-500    hover:!text-blue-600 w-full text-sm"
          >
            <TbLogout /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DNavProfile;
