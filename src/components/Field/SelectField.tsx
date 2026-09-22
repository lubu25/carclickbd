import { Select } from 'antd';
export type SelectOptions = {
    label: string;
    value: string;
};
type SelectFieldProps = {
    options: SelectOptions[];
    size?: "large" | "small";
    handleChange?: (el: string) => void;
    placeholder: string;
};

const SelectField = ({ handleChange, options, placeholder }: SelectFieldProps) => {
    return (
        <Select
            onChange={handleChange}
            showSearch
            style={{ width: 200 }}
            placeholder={placeholder}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={options}
        />
    );
};

export default SelectField;