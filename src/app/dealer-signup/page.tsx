import SellerSignupForm from "@/components/auth/sellerSignup/SellerSignupForm";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";

const DealerSignupPage = () => {
  return (
    <LoggedInRedirect>
      <SellerSignupForm sellerType="dealer" />
    </LoggedInRedirect>
  );
};

export default DealerSignupPage;
