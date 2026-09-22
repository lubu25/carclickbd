import CreateProductForm from "@/components/dashboardlayout/create-product/components/CreateProduct";

const AdminProductEditPage = ({ params }: { params: { id: string } }) => {
  return <CreateProductForm productId={params.id} />;
};

export default AdminProductEditPage;
