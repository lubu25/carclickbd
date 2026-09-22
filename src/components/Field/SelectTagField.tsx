"use client";

import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { Divider, Select } from 'antd';
import { Controller, useFormContext } from "react-hook-form";


export type SelectOptions = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    options: SelectOptions[];
    name: string;
    size?: "large" | "small";
    value?: string | string[] | undefined;
    placeholder?: string;
    label?: string;
    defaultValue?: SelectOptions;
    handleChange?: (el: string) => void;
};

const SelectTagField = ({
    name,
    size = "large",
    value,
    placeholder = "Select",
    options,
    label,
    defaultValue,
    handleChange,
}: SelectFieldProps) => {
    const { control, formState: { errors }, } = useFormContext();
    const errorMessage = getErrorMessageByPropertyName(errors, name);

    return (
        <>
            {label ? label : null}
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <Select
                        mode="tags"
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                            </>
                        )}
                        onChange={handleChange ? handleChange : onChange}
                        size={size}
                        options={options}
                        value={value}
                        style={{ width: "100%" }}
                        placeholder={placeholder}
                    />
                )}
            />
            <small style={{ color: "red" }}>{errorMessage}</small>
        </>
    );
};

export default SelectTagField;