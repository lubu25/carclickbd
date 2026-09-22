"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { message, Modal, Button } from "antd";
import { FaCamera } from "react-icons/fa";
import SingleImageUploader from "@/components/shared/inputs/SingleImageUploader";
import { IUser } from "@/Interface/user";
import { useUpdateUserMutation } from "@/Redux/api/userApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setProfileInfo } from "@/Redux/Slices/authSlice";
import { getMediaUrl } from "@/utils/media";

const ProfilePictureUploader: React.FC<{
  user: IUser;
  triggerButtonTitle?: string;
  compact?: boolean;
}> = ({ user, triggerButtonTitle, compact }) => {
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [defaultImgUrl, setDefaultUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.profilePhoto) {
      setDefaultUrl(getMediaUrl(user.profilePhoto));
    }
  }, [user?.profilePhoto]);

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const dispatch = useAppDispatch();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUpdate = async () => {
    const data = new FormData();
    if (!imgFile) {
      return message.error("Please select your profile picture");
    }

    data.append("file", imgFile);
    data.append("data", JSON.stringify({}));

    const res = await updateUser(data).unwrap();

    if (res?.statusCode === 200) {
      message.success("Profile picture updated successfully!");
      dispatch(setProfileInfo(res.data));
      setIsModalOpen(false);
    } else {
      message.error("Failed to update profile picture");
    }
  };

  return (
    <div>
      {triggerButtonTitle ? (
        <Button
          onClick={handleOpenModal}
          className="mt-3 md:mt-0 flex items-center justify-center w-full"
        >
          {triggerButtonTitle}
        </Button>
      ) : (
        <button
          type="button"
          onClick={handleOpenModal}
          className="group flex w-full items-center justify-center"
        >
          <div
            className={`relative flex items-center justify-center rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow-xl ring-1 ring-slate-200 transition group-hover:ring-sky-300 ${
              compact ? "h-24 w-24" : "mb-4 h-32 w-32"
            }`}
          >
            <span className="absolute bottom-1 right-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f0b90b] text-sm text-slate-950 shadow-md">
              <FaCamera />
            </span>
            {defaultImgUrl ? (
              <Image
                width={128}
                height={128}
                src={getMediaUrl(user.profilePhoto)}
                alt="Default Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="px-3 text-center text-xs font-semibold text-slate-500">
                Upload profile picture
              </div>
            )}
          </div>
        </button>
      )}

      <Modal
        title="Upload Profile Picture"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdate}
            loading={isLoading}
          >
            Upload
          </Button>,
        ]}
      >
        <SingleImageUploader
          setImageFile={setImgFile}
          className="w-40 h-40"
          isForProfile
        />
      </Modal>
    </div>
  );
};

export default ProfilePictureUploader;
