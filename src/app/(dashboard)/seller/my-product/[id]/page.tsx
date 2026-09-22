import ProductDetails from "@/components/dashboardlayout/ProductDetails";

const SellerProductDetailsPage = ({ params }: { params: { id: string } }) => {
  return <ProductDetails productId={params.id} />;
};

export default SellerProductDetailsPage;
