"use client";
import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
// components
import cn from "@/lib/cn";
// icon
import { RiArrowDownSLine } from "react-icons/ri";
import ClickOutside from "../event/clickOutSide";

interface IOption {
  value: string;
  label: string | React.ReactNode;
}
// interface
export interface IFormSelectOption {
  value: string;
  label: string | React.ReactNode;
  subOption?: IOption | any;
}

interface CustomSelectProps {
  required?: boolean;
  label?: string;
  placeholder?: string;
  options: IFormSelectOption[] | any;
  setValue: React.Dispatch<SetStateAction<string | null | any>>;
  setOption?: React.Dispatch<SetStateAction<IFormSelectOption | any>>;
  defaultValue?: string;
  dropdownOverlayStyle?: string;
  triggerButtonStyle?: string;
  optionStyle?: string;
}

const FormSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  setValue,
  setOption,
  defaultValue,
  placeholder = "Select an option",
  required = false,
  dropdownOverlayStyle,
  triggerButtonStyle,
  optionStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<IFormSelectOption | null>(null);

  const makeSelectOption = (value: string) => {
    const option = { label: value, value: value };
    return option;
  };
  // Set default value on component mount
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      const option = makeSelectOption(defaultValue as string);
      setSelectedOption(option);
    }
  }, [defaultValue, setValue]);

  const handleOptionClick = (option: IFormSelectOption) => {
    setOption && setOption(option);
    setSelectedOption(option);
    setValue(option.value);
    setIsOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ClickOutside onClick={() => setIsOpen(false)} className="relative w-full">
      {/* Input Label */}
      <div className="flex items-center mb-1">
        {label && (
          <label className="font-medium text-sm text-gray-800">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
      </div>

      {/* Select Trigger Button */}
      <button
        type="button"
        className={cn(
          `w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 hover:border-blue-500 rounded-md shadow-sm focus:outline-none capitalize transition-colors duration-300 text-gray-500 font-[600] text-sm ${isOpen && "border-blue-500"}`,
          triggerButtonStyle,
        )}
        onClick={handleDropdownToggle}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <RiArrowDownSLine
          className={cn(
            "transition-transform duration-500 ease-in-out text-lg",
            {
              "rotate-180": isOpen,
            },
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-10 w-full mt-1 max-h-44 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg",
            dropdownOverlayStyle,
          )}
        >
          {options?.map((option: IFormSelectOption) => (
            <button
              type="button"
              key={option.value}
              className={cn(
                `px-4 py-2 block text-left w-full hover:bg-blue-100 capitalize text-sm  ${selectedOption?.value === option?.value && "bg-blue-500 text-white hover:bg-blue-500 "}`,
                optionStyle,
              )}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </ClickOutside>
  );
};

export default FormSelect;
