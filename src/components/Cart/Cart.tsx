"use client"

import { IProduct } from '@/Interface/product';
import { addToCart, clearCart, decreaseCartQuantity, getTotal, removeFromCart } from '@/Redux/features/cart/cartSlice';
import { useAppDispatch } from '@/Redux/hooks';
import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Image from 'next/image';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getMediaUrl } from '@/utils/media';

interface RootState {
    cart: {
        addToCart: IProduct[];
        cartTotalQuantity: number;
        cartTotalAmount: number;
    };
}

export default function CartPage() {
    const items = useSelector((state: RootState) => state?.cart?.addToCart);
    const dispatch = useAppDispatch();

    const totaqlQuantity = useSelector((state: RootState) => state?.cart?.cartTotalQuantity);
    const cartTotalAmount = useSelector((state: RootState) => state?.cart?.cartTotalAmount);

    useEffect(() => {
        dispatch(getTotal());
    }, [dispatch, items]);
    return (

        <div title="Products">
            <DeleteOutlined className=' text-red-500' onClick={() => dispatch(clearCart(items))} />
            <h4>Total Price: {cartTotalAmount}</h4>
            <h4>Total Item: {totaqlQuantity}</h4>
            {items?.map((item) => <>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                >
                    <div className='flex justify-between'>
                        <div className='flex gap-3 items-center'>
                            <div>
                                <Image
                                    src={getMediaUrl(item?.photos.mainPhoto)}
                                    alt=""
                                    width={50}
                                    height={50}
                                />
                            </div>
                            <div className=' flex flex-col'>
                                <p>Name: {item?.title}</p>
                                <p>Quantity: {item?.highestBid}</p>
                            </div>
                        </div>
                        <div className=' flex flex-col gap-3 text-xl'>
                            <DeleteOutlined className=' text-red-500' onClick={() => dispatch(removeFromCart(item))} />
                            <PlusSquareOutlined onClick={() => dispatch(addToCart(item))} />
                            <MinusSquareOutlined onClick={() => dispatch(decreaseCartQuantity(item))} />
                        </div>
                    </div>
                </Card>
            </>
            )}
        </div>

    );
}
