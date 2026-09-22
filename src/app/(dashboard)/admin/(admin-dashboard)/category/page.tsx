"use client"
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Form, Select, message } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation, // Import delete mutation
  useUpdateCategoryMutation,
  useGetAllCategoriesQuery,
} from "@/Redux/api/categoryApi";
import dayjs from "dayjs";


interface CategoryData {
  key: string;
  name: string;
  type: "Category" | "Subcategory";
  parentCategory?: string;
  createdAt?: string; // Add the createdAt field here
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create"); // Track whether it's create or edit mode
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation modal
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(null); // Store category to delete

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation(); // Delete mutation

  const { data: response } = useGetAllCategoriesQuery({ page: 1, limit: 20 });

  useEffect(() => {
    if (response?.data) {
      const formattedCategories = response.data.map((cat: any) => {
        const parentCategoryName = cat.parentCategory
          ? typeof cat.parentCategory === "object"
            ? cat.parentCategory.title || "Unknown Parent"
            : cat.parentCategory
          : "No Parent";
  
        return {
          key: cat._id,
          name: cat.title,
          type: cat.parentCategory ? "Subcategory" : "Category",
          parentCategory: parentCategoryName,
          createdAt: cat.createdAt, // Ensure 'createdAt' is included in the data
        };
      });
  
      setCategories(formattedCategories);
    }
  }, [response]);

  const handleEdit = (category: CategoryData) => {
    setEditingCategory(category);
    setFormMode("edit");
    setIsModalVisible(true);
  };

  const handleCreateOrUpdate = async (values: { title: string; type: "Category" | "Subcategory"; parentCategory?: string }) => {
    try {
      setIsLoading(true);
      if (formMode === "create") {
        if (values.type === "Subcategory" && values.parentCategory) {
          const createdSubCategory = await createCategory({
            title: values.title,
            parentCategory: values.parentCategory,
          }).unwrap();
          setCategories((prevCategories) => [
            ...prevCategories,
            {
              key: createdSubCategory._id,
              name: createdSubCategory.title,
              type: "Subcategory",
              parentCategory: createdSubCategory.parentCategory,
            },
          ]);
          message.success("Subcategory created successfully!");
        } else if (values.type === "Category") {
          const createdCategory = await createCategory({ title: values.title }).unwrap();
          setCategories((prevCategories) => [
            ...prevCategories,
            { key: createdCategory._id, name: createdCategory.title, type: "Category" },
          ]);
          
          message.success("Category created successfully!");
        }
      } else if (formMode === "edit" && editingCategory) {
        const updatedCategory = await updateCategory({
          id: editingCategory.key,
          title: values.title,
        }).unwrap();
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat.key === updatedCategory._id ? { ...cat, name: updatedCategory.title } : cat
          )
        );
        message.success("Category updated successfully!");
      }
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error?.message || "Failed to create/update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!categoryToDelete) return;
      setIsLoading(true);
      // Pass the category's key directly as a string
      await deleteCategory(categoryToDelete.key).unwrap();
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.key !== categoryToDelete.key));
      message.success("Category deleted successfully!");
      setIsDeleteModalVisible(false);
    } catch (error: any) {
      message.error(error?.message || "Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
  };

  const columns: ColumnsType<CategoryData> = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: any) => (
        <>
          {toTitleCase(text)}
          {record.type === "Subcategory" && <span style={{ color: 'gray' }}> (Sub Category)</span>}
        </>
      ),
      filters: [
        { text: "Category", value: "Category" },
        { text: "Subcategory", value: "Subcategory" },
      ],
      onFilter: (value, record) => record.type === value,
        
    },
    {
      title: "Main Category",
      dataIndex: "parentCategory",
      key: "parentCategory",
      sorter: (a, b) => (a.parentCategory || "").localeCompare(b.parentCategory || ""),
      sortDirections: ["ascend", "descend"],
      render: (_, record) => {
        return record.type === "Subcategory" ? toTitleCase(record.parentCategory || "N/A") : "——";
      },
    },
    
    
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["md", "lg", "xl"],
      render: (createdAt) => (
        <span>{createdAt ? dayjs(createdAt).format("MMM D, YYYY HH:mm") : "N/A"}</span>
      ),
      sorter: (a, b) => {
        const dateA = dayjs(a.createdAt);
        const dateB = dayjs(b.createdAt);
        return dateA.isAfter(dateB) ? 1 : dateA.isBefore(dateB) ? -1 : 0;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button color="primary" variant="filled" onClick={() => handleEdit(record)} style={{ marginRight: 8 }} >
            Edit
          </Button>
          <Button
            onClick={() => {
              setCategoryToDelete(record);
              setIsDeleteModalVisible(true);
            }}
            color="danger"
            variant="filled"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
        <Input
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-96"
        />
        </div>
        <Button type="primary" onClick={() => { setFormMode("create"); setIsModalVisible(true); }}>
          Create Category
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCategories}
        pagination={{ pageSize: 20 }}
        bordered
      />

      {/* Create/Edit Modal */}
      <Modal
        title={formMode === "create" ? "Create Category" : "Update Category"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleCreateOrUpdate} layout="vertical">
          <Form.Item
            label="Name"
            name="title"
            initialValue={editingCategory?.name}
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            initialValue={editingCategory?.type || "Category"}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Category">Category</Select.Option>
              <Select.Option value="Subcategory">Subcategory</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item shouldUpdate={(prev, curr) => prev.type !== curr.type} noStyle>
            {({ getFieldValue }) =>
              getFieldValue("type") === "Subcategory" && (
                <Form.Item
                  label="Parent Category"
                  name="parentCategory"
                  initialValue={editingCategory?.parentCategory}
                  rules={[{ required: true, message: "Please select a parent category!" }]}
                >
                  <Select>
                    {categories.filter((cat) => cat.type === "Category").map((cat) => (
                      <Select.Option key={cat.key} value={cat.key}>
                        {cat.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {formMode === "create" ? "Create" : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Category"
        visible={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        confirmLoading={isLoading}
      >
        <p>Are you sure you want to delete this category?</p>
      </Modal>
    </div>
  );
};

export default CategoryPage;
