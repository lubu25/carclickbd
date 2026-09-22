"use client";

import BDGate from "@/components/Cart/BDGate";
import { useOrderQuery } from "@/Redux/api/orderApi";
import { Col, Row } from "antd";
import { useState } from "react";

const CheckoutPage = ({ params }: any) => {

  const { data, isLoading, } = useOrderQuery(params?.id)
  const order = data?.data || data;

  const [paymentStatus, setPaymentStatus] = useState("");
  return (
    <div>
      <div className="flex justify-between items-center bg-white px-10">
        <h4>CHECKOUT</h4>
       
      </div>
      <div>
        <div >
          <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
            <Col span={12} >

              <h3>BDGate Payment</h3>

              <Row gutter={20} className=" bg-white my-4 p-8">
                <Col span={24}>
                  <div>
                    <BDGate
                      data={order}
                      setPaymentStatus={setPaymentStatus}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={20} className=" bg-white px-8 py-8 my-4">
                <Col>
                  <div>
                    <h2>
                      Payable amount: BDT{" "}
                      {Number(order?.totalAmount || 0).toLocaleString("en-US")}
                    </h2>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

        </div>
      </div>

    </div>
  );
};

export default CheckoutPage;
