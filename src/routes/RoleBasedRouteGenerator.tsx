import { getTokenInfo } from "@/service/auth.service";

const HasAccess = (userRole: string) => {
  const user = getTokenInfo();
  const role = user?.role;

  const hasAccess =
    role === userRole || (userRole === "customer" && role === "buyer");

  return hasAccess;
};

export default HasAccess;
