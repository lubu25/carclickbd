
export type INotification = {
  _id: string;
  product: string;
  message?: string;
  status: string;
  isRead?: boolean;
  overBid?: number;
  itemName?: string;
  createdAt?: string;
};
