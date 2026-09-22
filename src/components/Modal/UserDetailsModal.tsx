import { Modal, Avatar, Descriptions, Tag, Space, Divider, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { IUser } from "@/Interface/user";
import { getMediaUrl } from "@/utils/media";

const { Title, Text } = Typography;

interface UserDetailsModalProps {
  isVisible: boolean;
  user: IUser | null;
  onClose: () => void;
}

const getTagColor = (value: string | undefined) => {
  switch (value) {
    case "super-admin":
      return "volcano";
    case "admin":
      return "geekblue";
    case "seller":
      return "blue";
    case "customer":
      return "cyan";
    default:
      return "default";
  }
};

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isVisible,
  user,
  onClose,
}) => {
  return (
    <Modal
      title={<Title level={4} className="mb-0">User Details</Title>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
    >
      {user && (
        <>
          <div className="flex items-center gap-4 mb-4">
            <Avatar
              size={72}
              src={user.profilePhoto ? getMediaUrl(user.profilePhoto) : undefined}
              icon={<UserOutlined />}
            />
            <div>
              <Title level={5} className="mb-1">{user.name || "Unnamed User"}</Title>
              <Space>
                <Tag color={getTagColor(user.role)}>{user.role || "N/A"}</Tag>
                {user.accountType && (
                  <Tag color="gold">{user.accountType}</Tag>
                )}
              </Space>
            </div>
          </div>

          <Divider orientation="left">Contact Info</Divider>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Email">
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Number">
              {user.contactNo || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left">Account Details</Divider>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
            <Descriptions.Item label="Membership">
              {user.membership || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Total Products">
              {user.totalProduct ?? "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {new Date(user.updatedAt).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
