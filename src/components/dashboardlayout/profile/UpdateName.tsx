"use client";
import { Modal, Button, message } from "antd";
import Form from "@/components/shared/inputs/Form";
import FormInput from "@/components/shared/inputs/FormInput";
import { useUpdateUserMutation } from "@/Redux/api/userApi";
import { useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { useAppDispatch } from "@/Redux/hooks";
import { setProfileInfo } from "@/Redux/Slices/authSlice";

const UpdateName = () => {
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [updateUser] = useUpdateUserMutation();

  // Handle Modal open/close
  const toggleModal = () => {
    setOpen(!isOpen);
  };

  const dispatch = useAppDispatch();

  const handleUpdate = async (name: any) => {
    const data = new FormData();
    try {
      setIsLoading(true);
      data.append("data", JSON.stringify(name));
      const res = await updateUser(data).unwrap();

      if (res?.statusCode === 200) {
        message.success("Name updated successfully");
        console.log(res?.data);
        dispatch(setProfileInfo(res?.data));
        toggleModal();
      } else {
        message.error("Failed to update name");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        title="Update Name"
        open={isOpen}
        onCancel={toggleModal}
        footer={null}
        confirmLoading={isLoading}
      >
        <div>
          <Form submitHandler={handleUpdate}>
            <div className="mt-5 mb-2">
              <FormInput
                name="name"
                type="text"
                placeholder="Enter your name"
                label="Name"
                required
              />
            </div>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Update
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateName;
