
import React from 'react';
import { Modal, Typography, Button, Row, Col } from 'antd';
import { LuPrinter } from 'react-icons/lu';
import { FaRegCopy } from 'react-icons/fa';
import BDGate from '@/components/Cart/BDGate';
import { IOrder } from '@/Interface/order';

const { Title, Text } = Typography;

interface OrderSummaryModalProps {
      isOpen: boolean;
      onClose: () => void;
      order: IOrder | null;
      onPaymentSuccess: (paymentMethod: string) => void;
      totalAmount: number | null; // Added totalAmount prop
      paymentStatus: string | null; // Added paymentStatus prop
      setPaymentStatus: (status: string | null) => void; // Added setPaymentStatus prop
    }

const PaymentModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  order,
  paymentStatus,
  setPaymentStatus,
}) => {
  if (!order) {
    return null; // Or a loading/error state
  }

  return (
    <Modal
      title="Order Summary & Payment"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800} // Adjust width as needed to fit the layout
      className="order-summary-modal" // Optional custom class for styling
    >
      <Row gutter={[32, 24]}>
        <Col xs={24} md={12}>
          <div className="bg-gray-50 rounded-md p-6 shadow-sm">
            <Title level={4} className="text-gray-700 mb-4">
              Secure Payment Method
            </Title>
            <div className="flex flex-col gap-4">
              <BDGate data={order} setPaymentStatus={setPaymentStatus} />
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="bg-[#23618b] text-white rounded-md">
            <div className="lg:px-5 px-2 pt-2 lg:pt-5">
              <h2 className="font-bold lg:text-xl pb-2 my-2 text-white border-b-[0.5px] border-green-900">
                Order Summary
              </h2>
              <div>
                <div className=" w-full flex items-center justify-between text-sm md:text-md xl:text-lg py-2 border-b-[0.5px] border-green-900">
                  <p className="text-white">Order Name:</p>
                  <p className="text-lg font-bold uppercase text-yellow-500">
                    {order?.orderType}
                  </p>
                </div>
              </div>
            </div>
            <section className="w-full p-5 bg-[#004979] text-white text-sm md:text-lg lg:text-xl rounded-b-md">
              <h2 className="flex items-center justify-between font-semibold ">
                <span>Total Price</span>
                <span className="font-bold text-xl lg:text-2xl">
                  BDT {Number(order?.totalAmount || 0).toLocaleString("en-US")}
                </span>
              </h2>
              <button className="py-3 text-sm md:text-md xl:text-lg text-center text-gray-800 font-bold mt-5 w-full rounded-full bg-orange-400 hover:bg-orange-300 transition-colors duration-300">
                <Text
                  type={paymentStatus ? "success" : "secondary"}
                  className={`font-bold ${
                    paymentStatus ? "text-green-100" : "text-gray-200"
                  }`}
                >
                  {paymentStatus || " Not paid yet"}
                </Text>
              </button>

              <div className="my-5 flex items-center gap-5">
                <button className="flex items-center gap-1 text-xl lg:text-2xl">
                  <LuPrinter />
                  <span className="hover:underline text-sm md:text-lg lg:text-xl">
                    Print
                  </span>
                </button>
                <button className="flex items-center gap-1 text-xl lg:text-2xl">
                  <FaRegCopy />
                  <span className="hover:underline text-sm md:text-lg lg:text-xl">
                    Copy
                  </span>
                </button>
              </div>
              <Button type="primary" className="mt-4 w-full" onClick={onClose}>
                Close
              </Button>
            </section>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default PaymentModal;
