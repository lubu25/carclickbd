import { setLogOut } from "@/Redux/Slices/authSlice";
import { adminRoutes } from "@/routes/adminRoutes";
import { agentRoutes } from "@/routes/agentRoutes";
import { customerRoutes } from "@/routes/customerRoutes";
import { sellerRoutes } from "@/routes/sellerRoutes";
import { subAgentRoutes } from "@/routes/subAgentRoutes";
import { superRoutes } from "@/routes/superRoutes";

export const getMenuContent = (tokenInfo: any, dispatch: any) => {
  switch (tokenInfo?.role) {
    case "admin":
    case "super-admin":
      return adminRoutes;
    case "super":
      return superRoutes;
    case "agent":
      return agentRoutes;
    case "sub-agent":
      return subAgentRoutes;
    case "seller":
      return sellerRoutes;
    case "customer":
    case "buyer":
      return customerRoutes;
    default:
      return [];
  }
};
