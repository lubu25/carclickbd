import React from "react";
import { Space, Button, Input } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const { Search } = Input;

interface TableHeaderProps {
  onSearch: (value: string) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  onSearch,
  onClearFilters,
  onRefresh,
}) => {
  return (
    <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
      <Space>
        <Search
          placeholder="Search by name or email..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </Space>
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onRefresh}>
          Refresh
        </Button>
        <Button icon={<ClearOutlined />} onClick={onClearFilters}>
          Clear Filters
        </Button>
      </Space>
    </div>
  );
};

export default TableHeader;
