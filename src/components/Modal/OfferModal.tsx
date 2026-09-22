import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface Offer {
  id: string;
  title: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  description: string;
}

interface OfferModalProps {
  visible: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  onFinish: (values: Offer) => void;
  onSave: (values: Offer) => void; 
  form: any;
  currentOffer: Offer | null;
}



const OfferModal: React.FC<OfferModalProps> = ({
  visible,
  isEditMode,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title={isEditMode ? "Edit Offer" : "Add Offer"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Code"
          name="code"
          rules={[{ required: true, message: "Code is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Discount is required" }]}
        >
          <Input type="number" min={0} max={100} />
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Start date is required" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "End date is required" }]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {isEditMode ? "Save Changes" : "Add Offer"}
        </Button>
      </Form>
    </Modal>
  );
};

export default OfferModal;
