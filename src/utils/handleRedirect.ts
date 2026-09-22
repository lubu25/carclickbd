const handleRedirect = (role: string, router: any) => {
  switch (role) {
    case "admin":
    case "super-admin":
      router.push("/admin");
      break;
    case "seller":
      router.push("/seller");
      break;
    case "customer":
    case "buyer":
      router.push("/customer");
      break;
    default:
      router.push("/");
      break;
  }
};

export default handleRedirect;
