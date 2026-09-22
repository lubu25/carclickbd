"use client";

import Form from "@/components/shared/inputs/Form";
import FormInput from "@/components/shared/inputs/FormInput";
import { useUpdateUserMutation } from "@/Redux/api/userApi";
import { useAppDispatch } from "@/Redux/hooks";
import { setProfileInfo } from "@/Redux/Slices/authSlice";
import { bangladeshiContactNumberSchema } from "@/schema/auth.schema";
import { getTokenInfo } from "@/service/auth.service";
import { Button, message, Modal } from "antd";
import { useState } from "react";

import { FaPencil } from "react-icons/fa6";

const UpdateContactNo = () => {
  const [isOpen, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [updateUser, { isLoading }] = useUpdateUserMutation();
  //   handleClose and Open
  const toggleModal = () => {
    setOpen(!isOpen);
  };

  const tokenInfo = getTokenInfo();
  const id = tokenInfo?.userId as string;
  const dispatch = useAppDispatch();

  const handleUpdate = async (number: any) => {
    const data = new FormData();
    data.append("data", JSON.stringify(number));

    updateUser(data)
      .unwrap()
      .then((res: any) => {
        if (res?.statusCode === 200) {
          setErrorMessage(null);

          dispatch(setProfileInfo(res?.data));
          message.success("Contact no. updated successfully.");
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
          <Form
            resolver={bangladeshiContactNumberSchema}
            submitHandler={handleUpdate}
          >
            <div className="mb-2">
              <FormInput
                name="contactNo"
                type="text"
                placeholder="Enter your contact number"
                label="Contact No."
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

export default UpdateContactNo;
