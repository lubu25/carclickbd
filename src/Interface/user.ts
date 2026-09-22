export type IUser = {
  updatedAt: string;
  _id?: string;
  name?: string;
  businessName?: string;
  email: string;
  password: string;
  address?: string;
  showroomOfficeAddress?: string;
  photo: string;
  role?: "customer" | "admin" | "super-admin" | "seller";
  accountType?: "personal" | "dealer";
  sellerType?: "personal" | "dealer";
  isDisabled?: boolean | "disable" | "enable";
  documents?: string[];
  membership?: "free" | "faid";
  contactNo?: string;
  whatsappNumber?: string;
  profilePhoto?: string;
  passwordChangedAt?: Date;
  isEmailVerified?: boolean;
  isVerified?: boolean;
  totalProduct?: number; 
};

export type ICommonProfile = {
  id: string;
  _id?: string;
  name?: string;
  businessName?: string;
  email?: string;
  profilePhoto?: string;
};

export interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IUser[];
}
