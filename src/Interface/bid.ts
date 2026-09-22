import { IProduct } from "./product";
import { IUser } from "./user";

export type IBid = {
      _id: string;
      product: IProduct;
      bidAmount: number;
      buyer: IUser;
      createdAt: string;
    };