import { ICommonUser } from "./common";

export interface INavChildrenItem {
  icon?: React.ReactNode;
  label: string;
  route: string;
}

export interface IDNavMenuItem {
  icon: React.ReactNode;
  label: string;
  route?: string;
  children?: INavChildrenItem[];
}

export interface INotificationMessage {
  type: "message" | "alert";
  user: ICommonUser;
  lastMessage: string;
  time: string;
}
