"use client";
import React, { SetStateAction, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "antd";
import ReUseAbleInput from "@/components/shared/inputs/ReUseableInput";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { useIsUserExistMutation } from "@/Redux/api/authApi";

interface EmailFormValues {
  email: string;
}

const EmailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
});

const SignupEmail: React.FC<{
  setEmail: React.Dispatch<SetStateAction<string | null>>;
  setNext: React.Dispatch<SetStateAction<boolean>>;
}> = ({ setEmail, setNext }) => {
  const [errorMessage, setError] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<EmailFormValues>({
    resolver: yupResolver(EmailValidationSchema),
  });

  const [isUserExist, { isLoading }] = useIsUserExistMutation();

  // Handling form submission
  const onSubmit = async (data: EmailFormValues) => {
    const result = await isUserExist(data).unwrap();
    if (result?.data?.isUserExist) {
      return setError("Sorry.This email is already registered.");
    } else {
      setEmail(data.email);
      return setNext(true);
    }
  };

  return (
    <div>
      <ReUseAbleInput
        validation={errors}
        name="email"
        placeholder="Email address"
        icon={<MailOutlined />}
        className="hover:border-primary border-gray-400"
        register={register}
        validationError={errors.email?.message}
      />
      {errorMessage && <p className="text-red-500 text-sm ">{errorMessage}</p>}

      <Button
        loading={isLoading}
        onClick={handleSubmit(onSubmit)} // Use handleSubmit for validation and submission
        type="primary"
        size="large"
        block
        className="!bg-green-500 hover:!bg-green-600 !text-black !mt-3"
      >
        Next
      </Button>
    </div>
  );
};

export default SignupEmail;
