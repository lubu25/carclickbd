"use client";
import CartItem from "@/components/Cart/CartItem";
import { IProduct } from "@/Interface/product";
import { useCreateOrderMutation } from "@/Redux/api/orderApi";
import { clearCart, getTotal } from "@/Redux/features/cart/cartSlice";
import { useAppDispatch } from "@/Redux/hooks";
import GetUserInfo from "@/service/profile.service";
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from 'react-redux';

interface RootState {
    cart: {
        addToCart: IProduct[];
        cartTotalQuantity: number;
        cartTotalAmount: number;
    };
}


const CheckoutPage = () => {
    const { id } = GetUserInfo() as any
    const router = useRouter()

    const items = useSelector((state: RootState) => state?.cart?.addToCart);
    const dispatch = useAppDispatch();

    const totalQuantity = useSelector((state: RootState) => state?.cart?.cartTotalQuantity);
    const cartTotalPrice = useSelector((state: RootState) => state?.cart?.cartTotalAmount);

    const [createOrder] = useCreateOrderMutation()
    useEffect(() => {
        dispatch(getTotal());
    }, [dispatch, items]);


    const onSubmit = async () => {
        const data = {
            totalQuantity,
            totalAmount: cartTotalPrice,
            userId: id,
            items
        }
        console.log("clicked", cartTotalPrice);
        message.loading("Creating.....");
        try {
            const res = await createOrder(data).unwrap();;
            if (!res.id) {
                message.error(" Couldn't create order");
            }
            else {
                message.success("order create successfully");
                router.push(`/buyer/cart/checkout/${res.id}`)
            }
        } catch (err: any) {
            console.error(err.message);
            message.error(err.message);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center bg-white px-10">
                <h4>CHECKOUT</h4>
            </div>
            <div>
                <div >
                    <Row gutter={{ xs: 24, xl: 8, lg: 8, md: 24 }}>
                        <Col span={10} >
                            <Row gutter={16} className=" bg-white my-4 px-10 ms-6">
                                <h3>Order Summary</h3>
                                <Card title="Products">
                                    <DeleteOutlined className=' text-[#003399]' onClick={() => dispatch(clearCart(items))} />
                                    <h4>Total Price: {cartTotalPrice}</h4>
                                    <h4>Total Item: {totalQuantity}</h4>
                                    {items?.map((item) => <>
                                        <CartItem item={item} /></>
                                    )}
                                </Card>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="bg-white my-2 px-6 py-2 ">
                        <Button onClick={onSubmit} className=" my-4" type="primary" htmlType="submit">
                            Place order
                        </Button>
                    </Row>
                </div>
            </div>

        </div>
    );
};

export default CheckoutPage;
