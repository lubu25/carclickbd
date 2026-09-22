import LandingHomePage from "@/components/publiclayout/home/Page";
import Container from "@/shared/wrapper/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CarClickBD | Home ",
  description: "Dealer and private seller car marketplace in Bangladesh",
};
const HomePage = () => {
  return <LandingHomePage />;
};

export default HomePage;
