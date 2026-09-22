export type IOrder = {
      _id: string;
      totalQuantity: number;
      totalAmount: number;
      isPending?: boolean;
      paymentStatus?: string;
      orderType?: string;
      orderNumber?: string;
      user?: string | { _id?: string; name?: string; email?: string };
      buyerInfo?: {
        name?: string;
        email?: string;
        phone?: string | number;
        address?: string;
      };
      chassisNumber?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
    
