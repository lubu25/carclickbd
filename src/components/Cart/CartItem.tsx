
import { IProduct } from '@/Interface/product';
import { addToCart, decreaseCartQuantity, removeFromCart } from '@/Redux/features/cart/cartSlice';
import { useAppDispatch } from '@/Redux/hooks';
import { DeleteOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Image from 'next/image';
import { getMediaUrl } from '@/utils/media';

interface CartItemProps {
    item: IProduct
}

const CartItem = ({ item }: CartItemProps) => {
    const dispatch = useAppDispatch();
    return (
        <div>
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
        </div>

    );
};

export default CartItem;
