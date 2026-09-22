import cn from "@/lib/cn";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

type TextAreaProps = {
  name: string;
  label?: string;
  className?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
};

const FormTextArea = ({
  name,
  label,
  className,
  value,
  defaultValue,
  placeholder,
}: TextAreaProps) => {
  const { control } = useFormContext();
  return (
    <div className={`flex flex-col  w-full`}>
      {label ? label : null}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            className={cn(
              "h-18  outline-none w-full border border-gray-300 hover:border-blue-500 light-darkmode rounded flex items-center py-[7px] px-3",
              className,
            )}
            placeholder={placeholder}
            {...field}
            value={value ? value : field.value}
            defaultValue={defaultValue}
          />
        )}
      />
    </div>
  );
};

export default FormTextArea;
