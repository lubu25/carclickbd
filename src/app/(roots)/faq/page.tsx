import { redirect } from "next/navigation";

const FAQPage = () => {
  redirect("/help?tab=faq");
};

export default FAQPage;
