"use client";
import Container from "@/shared/wrapper/Container";
import { useGetProductByIdQuery } from "@/Redux/api/productApi";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import WatchShare from "@/components/product/WatchShare";
import Gallery from "@/components/product/Gallery";
import AuctionNavBar from "@/components/product/AuctionNavbar";
import VehicleDetailsTable from "@/components/product/CarDetailsTable";
import CommentsSection from "@/components/product/CommentsSection";
import ProductSkeletonContainer from "@/components/product/skeleton/ProductSkeletonContainer";
import { DetailProductItemParents } from "@/components/product/DetailProductItemParents";
import BidInfoCard from "@/components/product/BidInfoCard";
import ProductsResult from "@/components/publiclayout/home/AcutionProducts/ProductsResult";

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { data, isLoading } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  if (isLoading) return <ProductSkeletonContainer />;

  const product = data?.data;
  if (!product) return <p className="text-center text-lg font-bold mt-10">No data available</p>;

  return (
    <main className="min-h-screen">
      <Container>
        <div className="flex items-center justify-between pt-6">
          <Breadcrumbs />
          <WatchShare productId={product?._id} isWatchlisted={product?.isWatchlisted} />
        </div>

        <Gallery product={product} />

        <section className="lg:flex gap-8 mt-8">
          <div className="lg:w-2/3">
            <AuctionNavBar product={product} />
            <VehicleDetailsTable vehicle={product} />
            <DetailProductItemParents product={product} />
            <BidInfoCard
              seller={product?.seller}
              productId={product?._id}
              highestBid={product?.highestBid}
              endBid={product?.endBid}
              minBid={product?.minBid}
            />
            <div className="h-screen overflow-auto">
              <CommentsSection comments={product?.comments} />
            </div>
          </div>
          <div className="hidden lg:block w-1/3 min-h-screen">
            <h2 className="text-2xl font-bold">Similar vehicles</h2>
            <ProductsResult
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6"
              isPaginate={false}
              isShowAll={false}
              isWinner={false}
              isDraft={false}
            />
          </div>
        </section>
      </Container>
    </main>
  );
};

export default ProductDetails;
