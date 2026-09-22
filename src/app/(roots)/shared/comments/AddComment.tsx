"use client";
import { fallbackProfileUrl } from "@/demo-data/product";
import { useCreateCommentMutation } from "@/Redux/features/comment/commentApi";
import { getTokenInfo } from "@/service/auth.service";
import ValidUserCheckAndRedirect from "@/shared/wrapper/ValidUserCheckAndRedirect";
import TextArea from "antd/es/input/TextArea";
import Image from "next/image";
import { useState } from "react";
import { CgSpinner } from "react-icons/cg";

// Define the props structure for the reusable AddComment component
type AddCommentProps = {
  productId: string;
};

const AddComment: React.FC<AddCommentProps> = ({ productId }) => {
  const [createComment, { isLoading: isCreateCommentLoading }] =
    useCreateCommentMutation();
  //step:1 State management for tracking the comment input
  const [newComment, setNewComment] = useState<string>("");

  const handleAddComment = async () => {
    // Prevent submitting an empty comment
    if (!newComment.trim()) return;

    // Create a new comment object
    const newCommentObj: { product: string; comment: string } = {
      product: productId,
      comment: newComment.trim(),
    };

    try {
      const res = await createComment(newCommentObj);
      console.log(res);
    } catch (error) {
      console.log(error);
    }

    setNewComment("");
  };

  const currentUser = getTokenInfo();
  // Return the UI layout
  return (
    <div className="mt-8 space-y-3">
      <div className="flex gap-4">
        {/* Display the user's avatar */}
        <div className="flex-shrink-0">
          <Image
            src={currentUser?.photo || fallbackProfileUrl}
            alt={currentUser?.name}
            width={52}
            height={52}
            className="rounded-full object-cover h-9 w-9"
          />
        </div>
        {/* Comment input and submission */}
        <div className="flex-1">
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full resize-none"
          />

          <div className="flex justify-end">
            <ValidUserCheckAndRedirect onClick={handleAddComment}>
              <button className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/80 transition-colors">
                {isCreateCommentLoading ? (
                  <CgSpinner className="animate-spin mr-2" />
                ) : (
                  "Add Comment"
                )}
              </button>
            </ValidUserCheckAndRedirect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComment;
