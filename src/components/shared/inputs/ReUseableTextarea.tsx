import cn from "@/lib/cn";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { ChangeEvent } from "react";
import { UseFormRegister } from "react-hook-form";

interface IInput<T extends Record<string, any>> {
  name: keyof T;
  placeholder?: string;
  validation?: object;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  register?: UseFormRegister<T>;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const ReUseAbleTextarea = <T extends Record<string, any>>({
  name,
  placeholder,
  validation,
  label,
  required = false,
  className,
  defaultValue,
  register,
  onChange,
}: IInput<T>) => {
  const errorMessage =
    validation &&
    getErrorMessageByPropertyName(validation as any, name as string);

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
      <div>
        <textarea
          {...(register && register(name as any))}
          placeholder={placeholder}
          className={cn(
            "h-18 outline-none w-full border border-gray-300 hover:border-blue-500 light-darkmode rounded flex items-center py-[7px] px-3",
            className,
          )}
          onChange={onChange}
          defaultValue={defaultValue}
        />
      </div>
      {errorMessage && <small className="text-red-500">{errorMessage}</small>}
    </div>
  );
};

export default ReUseAbleTextarea;
