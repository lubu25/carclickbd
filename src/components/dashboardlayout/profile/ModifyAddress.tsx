"use client";

import Form from "@/components/shared/inputs/Form";
import FormInput from "@/components/shared/inputs/FormInput";
import { useUpdateUserMutation } from "@/Redux/api/userApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setProfileInfo } from "@/Redux/Slices/authSlice";
import { getTokenInfo } from "@/service/auth.service";
import { Button, message, Modal } from "antd";
import { useState } from "react";

import { FaPencil } from "react-icons/fa6";

const UpdateAddress = () => {
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  //   handleClose and Open
  const toggleModal = () => {
    setOpen(!isOpen);
  };

  const dispatch = useAppDispatch();

  const handleUpdate = async (address: any) => {
    const data = new FormData();

    data.append("data", JSON.stringify(address));

    updateUser(data)
      .unwrap()
      .then((res: any) => {
        if (res?.statusCode === 200) {
          setErrorMessage(null);

          dispatch(setProfileInfo(res?.data));
          message.success("Address updated successfully.");
          toggleModal();
        } else {
          message.error(res?.error?.message);
          setErrorMessage(res?.error?.message);
        }
      })
      .catch(() => {
        setErrorMessage("An unexpected error occurred");
      });
  };

  return (
    <div>
      <Button
        type="text"
        icon={<FaPencil />}
        onClick={toggleModal}
        className="text-xs sm:text-sm"
      />

      <Modal
        width={400}
        title="Update ContactNo"
        open={isOpen}
        onCancel={toggleModal}
        footer={null}
        confirmLoading={isLoading}
      >
        <div className="max-w-[30rem]">
          <Form submitHandler={handleUpdate}>
            <div className="mb-2">
              <FormInput
                name="address"
                type="text"
                placeholder="Enter your address"
                label="Update Address"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 mb-1">{errorMessage}</p>
            )}

            <div>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                Update
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateAddress;
