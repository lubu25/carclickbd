"use client";
import { useCreateCategoryMutation } from "@/Redux/api/categoryApi";
import { getErrorMessageByPropertyName } from "@/utils/schema-validator";
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Select, Space, message } from 'antd';
import { useState } from 'react';
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

const FormSelectCategoryField = ({
  name,
  size = "large",
  value,
  placeholder = "select",
  options,
  label,
  defaultValue,
  handleChange,
}: SelectFieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  const errorMessage = getErrorMessageByPropertyName(errors, name);

  const [addCategory] = useCreateCategoryMutation();
  const [category, setCategory] = useState('');

  const submitHandler = async () => {
    try {
      const res = await addCategory({
        data: {
          category: {
            connectOrCreate: {
              where: { categoryTitle: category },
              create: { categoryTitle: category },
            },
          },
        },
      }).unwrap();
      if (res.id) {
        message.success("Category added successfully");
        setCategory('');
      } else {
        message.error("Category did not create");
      }
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <>
      {label ? label : null}
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <Select
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input onChange={(event) => setCategory(event.target.value)} placeholder="Please enter new category" value={category} />
                    <Button onClick={submitHandler} type="primary" size="small" htmlType="submit" icon={<PlusOutlined />}>
                      New
                    </Button>
                  </Space>
                </div>
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

export default FormSelectCategoryField;

