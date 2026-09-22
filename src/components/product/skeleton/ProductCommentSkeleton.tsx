const ProductCommentsSkeleton = () => {
  return (
    <div className="py-5  space-y-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-start space-x-4 animate-pulse">
          {/* Avatar Skeleton */}
          <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
          {/* Content Skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCommentsSkeleton;
