type IPackage = {
  internet?: string;
  voice?: string;
};

export type IOffer = {
  user?: string;
  _id: any;
  operator?: string;
  category?: string;
  package: IPackage;
  banner?: string;
  discountPercentage?: string;
  regularPrice: string;
  todayPrice: string;
  duration: string;
  termsAndConditions: string[];
};

export interface IOfferResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IOffer;
}
