import SellerSignupForm from "@/components/auth/sellerSignup/SellerSignupForm";
import LoggedInRedirect from "@/components/auth/LoggedInRedirect";

const IndividualSellerSignupPage = () => {
  return (
    <LoggedInRedirect>
      <SellerSignupForm sellerType="personal" />
    </LoggedInRedirect>
  );
};

export default IndividualSellerSignupPage;
