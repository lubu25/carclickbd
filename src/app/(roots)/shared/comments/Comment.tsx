import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiMessageCircle } from "react-icons/fi";
import LikeDislike from "./LikeDislike";
import AddReply from "./AddReply";
import { fallbackProfileUrl } from "@/demo-data/product";
import { useGetAllCommentsOnProductQuery } from "@/Redux/features/comment/commentApi";
import ProductCommentsSkeleton from "../../../../components/product/skeleton/ProductCommentSkeleton";

interface CommentsProps {
  productId?: string;
  commentsFromParent?: any[]; 
}

const Comments: React.FC<CommentsProps> = ({
  productId,
  commentsFromParent,
}) => {
  const { data: fetchedCommentData, isLoading: isCommentLoading } =
    useGetAllCommentsOnProductQuery(productId || "", {
      skip: !productId,
    });

  const [comments, setComments] = useState<any[]>(
    commentsFromParent || fetchedCommentData?.data || []
  );

  console.log({fetchedCommentData});
  

  useEffect(() => {
    if (fetchedCommentData && productId) {
      setComments(fetchedCommentData?.data || []);
    } else if (commentsFromParent) {
      setComments(commentsFromParent);
    }
  }, [fetchedCommentData, commentsFromParent, productId]);

  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const toggleExpand = (
    commentId: string,
    setExpanded: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setExpanded((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  if (isCommentLoading) return <ProductCommentsSkeleton />;

  return (
    <div className="p-6 border-t overflow-y-auto  border-gray-100 space-y-6">
      {comments?.map((comment: any) => (
        <div key={comment._id} className="group">
          <div className="flex gap-4">
            <Image
              src={comment?.user?.photo || fallbackProfileUrl}
              alt={comment?.user?.name || "User"}
              width={52}
              height={52}
              className="rounded-full object-cover h-9 w-9"
            />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font- text-black">
                  {comment?.user?.name || "Anonymous"}
                </span>
                <span className="text-sm text-gray-400">
                  {new Date(comment?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment?.comment}</p>

              <div className="flex items-center gap-4">
                <LikeDislike
                  isLiked={comment?.isLiked}
                  commentId={comment._id}
                  totalCommentCount={comment?.likes?.length}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(comment._id, setExpandedComments);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span>Reply</span>
                  {comment?.replies?.length > 0 && (
                    <span>{comment?.replies?.length}</span>
                  )}
                </button>
              </div>
              {expandedComments.includes(comment._id) && (
                <AddReply replies={comment?.replies} commentId={comment._id} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
