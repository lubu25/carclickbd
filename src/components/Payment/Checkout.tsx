"use client";
import BDGate from "@/components/Cart/BDGate";
import { useOrderQuery } from "@/Redux/api/orderApi";
import { Card, Col, Row, Typography, Spin,} from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";
import { LuPrinter } from "react-icons/lu";
import { FaRegCopy } from "react-icons/fa";

const { Title, Text } = Typography;

const Checkout = () => {
  const { id } = useParams();
  const { data, isLoading } = useOrderQuery(id);
  const order = data?.data;

  const [paymentStatus, setPaymentStatus] = useState("");

  return (
    <div className="bg-gray-100 py-16 flex justify-center items-center">
      <Card className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl w-full">
        <div className="px-8 py-6">
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-800">
              Secure Checkout
            </Title>
            <Text type="secondary" className="text-gray-500">
              Complete your payment securely with BDGate
            </Text>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[32, 24]}>
              <Col xs={24} md={10}>
                <div className="bg-gray-50 rounded-md p-6 shadow-sm">
                  <Title level={4} className="text-gray-700 mb-4">
                    Secure Payment Method
                  </Title>
                  <div className="flex flex-col gap-4">
                    <BDGate
                      data={order}
                      setPaymentStatus={setPaymentStatus}
                    />
                  </div>
                </div>
              </Col>

                <Col xs={24} md={10}
                  className="w-full
             bg-[#23618b] text-white"
                >
                  <div className="lg:px-5 px-2 pt-2 lg:pt-5">
                    {/* section title  */}
                    <h2 className="font-bold   lg:text-xl  pb-2 my-2 text-white border-b-[0.5px] border-green-900">
                      Order Summary
                    </h2>
                    {/* Shiiping INfo */}
                    <div>
                      <div className=" w-full flex items-center justify-between text-sm md:text-md  xl:text-lg py-2  border-b-[0.5px] border-green-900">
                      <p className="text-white">
                        Order Name:
                      </p>
                      <p className="text-lg  font-bold uppercase text-yellow-500">
                        {order?.orderType}
                      </p>
                      </div>
                    </div>
                  </div>
                  <section className="w-full p-5 h-[30%] bg-[#004979] text-white text-sm md:text-lg lg:text-xl">
                  <h2 className="flex items-center justify-between font-semibold ">
                    <span>Total Price</span>{" "}
                    <span className="font-bold text-xl lg:text-2xl">
                    BDT {Number(order?.totalAmount || 0).toLocaleString("en-US")}
                    </span>
                  </h2>
                  <button className="py-3 text-sm md:text-md xl:text-lg text-center text-gray-800 font-bold mt-5 w-full rounded-full bg-orange-400 hover:bg-orange-300 transition-colors duration-300">
                  <Text
                      type={paymentStatus ? "success" : "secondary"}
                      className={`font-bold ${
                        paymentStatus ? "text-green-500" : "text-gray-200"
                      }`}
                    >
                      {paymentStatus || " Not paid yet"}
                    </Text>
                  </button>

                  <div className="my-5 flex items-center gap-5">
                    <button className="flex items-center gap-1 text-xl lg:text-2xl">
                      <LuPrinter />{" "}
                      <span className="hover:underline text-sm  md:text-lg lg:text-xl">
                        Print
                      </span>
                    </button>
                    <button className="flex items-center gap-1 text-xl lg:text-2xl">
                      <FaRegCopy />{" "}
                      <span className="hover:underline text-sm md:text-lg lg:text-xl">
                        Copy
                      </span>
                    </button>
                  </div>
                </section>
                </Col>                
            </Row>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
