"use client";

export default function CardSkeleton() {
  return (
    <div className="lg:p-4 mt-8">
      <div className="grid grid-cols-1 !lg:grid-cols-3 gap-4 gap-y-8">
        {/* 1 */}
        <div className="space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg !animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-100 rounded !animate-pulse"></div>
        </div>
        {/* 1 */}
        <div className="space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg !animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-100 rounded !animate-pulse"></div>
        </div>
        {/* 1 */}
        <div className="space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg !animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-100 rounded !animate-pulse"></div>
        </div>
        {/* 1 */}
        <div className="space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg !animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-100 rounded !animate-pulse"></div>
        </div>
        {/* 1 */}
        <div className="space-y-4">
          <div className="w-full h-48 bg-gray-100 rounded-lg !animate-pulse"></div>
          <div className="w-2/3 h-6 bg-gray-100 rounded !animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
