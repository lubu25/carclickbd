import { useGetAllCategoriesQuery } from "@/Redux/api/categoryApi";
import FormSelectCategoryField from "./FormSelectCategoryField";
import { SelectOptions } from "./FormSelectField";

type CategoryFieldProps = {
  name: string;
  label?: string;

};

const CategoryField = ({ name, label, }: CategoryFieldProps) => {

  const { data, isLoading } = useGetAllCategoriesQuery({
    limit: 100,
    page: 1,
  });
  const categories = data?.categories;
  interface Category {
    id: string;
    categoryTitle: string;
  }

  interface CategoriesResponse {
    categories: Category[];
  }

  const categoryOptions = categories?.map((category: Category) => {
    return {
      label: category?.categoryTitle,
      value: category?.id,
    };
  });

  return (
    <FormSelectCategoryField
      name={name}
      label={label}
      options={categoryOptions as SelectOptions[]}
    />
  );
};

export default CategoryField;
