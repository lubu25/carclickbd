"use client";

import AddComment from "@/app/(roots)/shared/comments/AddComment";
import Comments from "@/app/(roots)/shared/comments/Comment";
import { useParams } from "next/navigation";
import ProductCommentsSkeleton from "./skeleton/ProductCommentSkeleton";

const CommentsSection = ({ comments }: { comments: any[] }) => {
  const { id } = useParams();

  return (
    <>
      <div className={" border-2 border-gray-100 p-4 md:p-6 my-8 rounded"}>
        <AddComment productId={`${id}`} />
        <Comments commentsFromParent={comments} />
      </div>
    </>
  );
};

export default CommentsSection;
