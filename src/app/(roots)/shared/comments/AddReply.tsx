import React, { useState } from "react";
import { Input } from "antd";
import Image from "next/image";
import { useAddReplyToCommentMutation } from "@/Redux/features/comment/commentApi";
import { fallbackProfileUrl } from "@/demo-data/product";
import { CgSpinner } from "react-icons/cg";
import ValidUserCheckAndRedirect from "@/shared/wrapper/ValidUserCheckAndRedirect";

const { TextArea } = Input;

const currentUser = {
  _id: "user123",
  name: "John Doe",
  photo: fallbackProfileUrl,
};

const AddReply = ({
  commentId,
  replies,
}: {
  commentId: string;
  replies: any;
}) => {
  const [addReplyToComment, { isLoading: isReplyToCommentLoading }] =
    useAddReplyToCommentMutation();
  const [replyText, setReplyText] = useState<string>("");

  const handleAddReply = async () => {
    if (!replyText.trim()) return;

    try {
      const res = await addReplyToComment({ commentId, replyText });
      console.log(res);
      setReplyText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-4   space-y-4">
      {replies.map((reply: any) => (
        <div
          key={reply._id}
          className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg"
        >
          <div className="flex-shrink-0">
            <Image
              src={reply.user?.photo || fallbackProfileUrl}
              alt={reply.user?.name || "Anonymous"}
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm">{reply.user?.name || "Anonymous"}</p>
            <p className="text-sm mt-2 text-gray-600">{reply.reply}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-4 items-start mt-6">
        <div className="flex-shrink-0">
          <Image
            src={currentUser.photo || fallbackProfileUrl}
            alt={currentUser.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div className="flex-1">
          <TextArea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            className="w-full resize-none"
          />
          <div className="flex justify-end">
            {/* reply or open signup modal */}
            <ValidUserCheckAndRedirect onClick={handleAddReply}>
              <button
                disabled={isReplyToCommentLoading}
                className="mt-2 px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/80 transition-colors disabled:bg-primary/40"
              >
                {isReplyToCommentLoading ? (
                  <CgSpinner className="animate-spin mr-2" />
                ) : (
                  "Reply"
                )}
              </button>
            </ValidUserCheckAndRedirect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReply;
