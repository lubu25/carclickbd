import CreateProductForm from "@/components/dashboardlayout/create-product/components/CreateProduct";

const SellerProductEditPage = ({ params }: { params: { id: string } }) => {
  return <CreateProductForm productId={params.id} />;
};

export default SellerProductEditPage;
