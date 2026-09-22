import Container from "@/shared/wrapper/Container";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import ProductCommentsSkeleton from "./ProductCommentSkeleton";

const ProductSkeletonContainer = () => {
  return (
    <Container>
      <ProductDetailsSkeleton />
      <div className="md:w-2/3 pb-20">
        <ProductCommentsSkeleton />
      </div>
    </Container>
  );
};

export default ProductSkeletonContainer;
