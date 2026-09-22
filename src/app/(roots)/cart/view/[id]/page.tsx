"use client";

import { useGetMyProductQuery } from "@/Redux/api/productApi";
import { DollarOutlined, FieldTimeOutlined, MergeCellsOutlined, TrophyOutlined } from "@ant-design/icons";
import type { TabsProps } from 'antd';
import { Col, Image, Row, Tabs } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const ProductDetailPage = ({ params }: any) => {
    const router = useRouter()
    const { data, isLoading } = useGetMyProductQuery(params?.id)
    const formattedDate = dayjs(data?.startDate).format("MMM D, YYYY hh:mm A");

    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Specification',
            children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: 'Details',
            children: 'Content of Tab Pane 2',
        },
    ];

    const base = "admin";
    return (
        <div>
            <div className="flex justify-between items-center bg-white px-10">
                <h4>PRODUCT DETAILS</h4>
               
            </div>
            <div className=" bg-white p-4 my-4">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={8}>
                        <div className=" bg-green-50" >
                            <Image
                                width="100%"
                                height="100%"
                                src={data?.productImage}
                                alt=""
                            />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={16}>
                        <div>
                            <h2>{data?.productTitle}</h2>
                            <div className=" flex gap-8">
                                <p>Brand: <span className=" font-semibold">{data?.brand}</span></p>
                                <p>seller: </p>
                                <p>Published: <span className=" font-semibold">{formattedDate}{ }</span></p>
                            </div>
                            <div className=" flex justify-between my-4">
                                <div className=" flex gap-3 items-center font-semibold border-dashed border-slate-100 px-8">
                                    <DollarOutlined className=" opacity-50 text-4xl text-white bg-green-700 rounded-full" />
                                    <p className=" flex flex-col items-center">
                                        <span>Buy Price:</span>
                                        <span>$120.40</span>
                                    </p>
                                </div>
                                <div className=" flex gap-3 items-center font-semibold border-dashed border-slate-100 px-8">
                                    <TrophyOutlined className="opacity-50 p-2 text-xl text-white bg-green-700 rounded-full" />
                                    <p className=" flex flex-col items-center">
                                        <span>Latest Offer:</span>
                                        <span>$420.90</span>
                                    </p>
                                </div>
                                <div className=" flex gap-3 items-center font-semibold border-dashed border-slate-100 px-8">
                                    <MergeCellsOutlined className="opacity-50 p-2 text-xl text-white bg-green-700 rounded-full" />
                                    <p className=" flex flex-col items-center">
                                        <span>Total Inquiries:</span>
                                        <span>120</span>
                                    </p>
                                </div>
                                <div className=" flex gap-3 items-center font-semibold border-dashed border-slate-100 px-8">
                                    <FieldTimeOutlined className="opacity-50 text-4xl text-white bg-green-700 rounded-full" />
                                    <p className=" flex flex-col items-center">
                                        <span>Time Left:</span>
                                        <span>{formattedDate}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="my-8">
                                <p className=" font-semibold">Description:</p>
                                <p>{data?.description}</p>
                            </div>
                            <div>
                                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ProductDetailPage;
