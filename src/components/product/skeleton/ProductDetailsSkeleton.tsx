const ProductDetailsSkeleton = () => {
  return (
    <div className="py-8 pt-14">
      <div className="h-8 w-2/3  bg-gray-100 animate-pulse rounded-md mb-3"></div>

      <div className="md:grid grid-cols-9 gap-4 ">
        <div className="h-full col-span-6 bg-gray-100 animate-pulse rounded-md"></div>
        <div className="grid grid-cols-1 col-span-3  gap-4 ">
          <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
          <div className="h-48 bg-gray-100 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
