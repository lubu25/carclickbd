import cn from "@/lib/cn";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import React, { ChangeEvent, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface IInput<T extends Record<string, any>> {
  name: keyof T | `${string}.${string}`;
  icon?: React.ReactNode;
  type?: string;
  value?: string | string[] | undefined;
  id?: string;
  placeholder?: string;
  validation?: object;
  validationError?: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  register?: UseFormRegister<T>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ReUseAbleInput = <T extends Record<string, any>>({
  name,
  type = "text",
  icon,
  placeholder,
  validation,
  label,
  required = false,
  className,
  defaultValue,
  validationError,
  register,
  onChange,
}: IInput<T>) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  const errorMessage =
    validation &&
    getErrorMessageByPropertyName(validation as any, name as string);

  const inputType = type === "password" && isVisible ? "text" : type;

  return (
    <div className="w-full">
      <div className="flex items-center mb-1">
        {label && (
          <label className="font-medium text-sm text-gray-800">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>
      <div
        className={cn(
          `my-1 w-full border bg-white border-gray-300 hover:border-blue-500 gap-2 rounded flex items-center py-[7px] px-3 ${errorMessage && "border-red-500"}`,

          className,
        )}
      >
        <span className={` md:text-lg ${errorMessage && "text-red-500"} `}>
          {icon && icon}
        </span>
        <input
          {...(register && register(name as any))}
          type={inputType}
          onChange={onChange}
          placeholder={placeholder}
          className="outline-none w-full bg-inherit"
          defaultValue={defaultValue}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setVisible(!isVisible)}
            className="ml-2"
          >
            {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
          </button>
        )}
      </div>

      {(errorMessage || validationError) && (
        <small className="text-red-500 text-sm">
          {errorMessage ? errorMessage : validationError}
        </small>
      )}
    </div>
  );
};

export default ReUseAbleInput;
