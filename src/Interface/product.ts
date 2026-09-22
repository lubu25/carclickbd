import { ICommonProfile, IUser } from "./user";
export interface BidInfo {
  biddingDuration: {
    startBid: string | Date | null;
    endBid: string | Date | null;
  };
  minBid?: number | string;
  highestBid?: number | string;
  totalBids?: number | string;

}

export type ProductListingStatus =
  | "pending"
  | "upcoming"
  | "approval"
  | "reserve"
  | "under_negotiations"
  | "sold";

export type IProduct = {
  _id: string;
  photos: {
    mainPhoto: string;
    others: string[];
  };
  mainPrice: number;
  price?: number | string;
  fixedPrice?: number | string;
  isAuction: boolean;
  isSoldOut: boolean;
  status?: ProductListingStatus;
  isWinner: boolean;
  title: string;
  stockNumber?: string;
  referenceNumber?: string;
  internalNote?: string;
  adminNote?: string;
  maker?: string;
  make: string;
  model: string;
  modelCode?: string;
  mileage: string;
  bidInfo: BidInfo;
  vin: string;
  titleStatus:
    | "clean (CT)"
    | "salvage"
    | "rebuilt/reconstructed"
    | "junk"
    | "buyback"
    | "bonded"
    | "export only"
    | "odometer rollback"
    | "flood"
    | "non-repairable";

  location?: {
    city: string;
    zipCode: number;
  };
  seller: ICommonProfile | string;
  engine: string;
  engineCc?: string;
  fuelType?: string;
  drivetrain: string;
  transmission: "automatic" | "manual";
  bodyStyle:
    | "coupe"
    | "convertible"
    | "hatchback"
    | "sedan"
    | "suv/crossover"
    | "truck"
    | "van/minivam"
    | "wagon";
  launchingYear: number;
  registrationYear?: number;
  productionYear: number;
  language?: "English" | "বাংলা" | string;
  exteriorColor: string;
  interiorColor: string;
  sellerType?: string;
  highlights: string[];
  equipment: string[];
  featuresAndOptions?: string[];
  featuresOptions?: string[];
  accessories?: string[];
  optionsList?: string[];
  optionsText?: string;
  options?: string;
  additionalOptions?: string;
  modification: string[];
  recentServiceHistory?: string[];
  otherItemsIncludedInSale?: string[];
  ownershipHistory: string;
  sellerNotes: string[];
  videos?: string[];
  views?: number;
  enabled: boolean;
  updatedAt: Date;
  highestBid: number;
  isDraft: boolean;
  isFeatured: boolean;
  startBid: Date | any;
  endBid: Date | any;
  totalBids: number;
  comments:any,
  minBid: number;
  maxBid: number;
  totalComment: number;
  createdAt: Date;
};
