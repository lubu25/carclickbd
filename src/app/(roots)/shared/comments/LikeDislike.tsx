"use client";
import { useToggleLikeDislikeCommentMutation } from "@/Redux/features/comment/commentApi";
import { useAppSelector } from "@/Redux/hooks";
import React, { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";

interface LikeDislikeProps {
  commentId: string;
  isLiked: boolean;
  totalCommentCount: number;
}

// const LikeDislike: React.FC<LikeDislikeProps> = ({ commentId, likes }) => {
const LikeDislike: React.FC<LikeDislikeProps> = ({
  commentId,
  isLiked,
  totalCommentCount,
}) => {
  const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn);
  const [toggleLikeDislikeComment] = useToggleLikeDislikeCommentMutation();
  const [isCommentLiked, setIsCommentLiked] = useState(isLiked);
  const [totalCommentCountState, setTotalCommentCountState] =
    useState(totalCommentCount);

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCommentLiked(!isLiked);

    // this logic is for immidiately respond the like dislike count
    // for more user friendly experiences
    if (isLiked) {
      setTotalCommentCountState(totalCommentCountState - 1);
    } else {
      setTotalCommentCountState(totalCommentCountState + 1);
    }

    // calling api to bring the change in database
    try {
      const res = await toggleLikeDislikeComment(`${commentId}`);
      console.log(res);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <button
      disabled={!isLoggedIn}
      onClick={handleLikeToggle}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
    >
      <FaThumbsUp
        className={`w-4 h-4 ${
          isCommentLiked ? "fill-primary text-primary font-bold" : ""
        }`}
      />
      <span>{totalCommentCountState}</span>
    </button>
  );
};

export default LikeDislike;
