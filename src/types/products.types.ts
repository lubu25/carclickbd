export type TUser = {
  _id: string;
  name: string;
  id: string;
  photo: string;
};

export type TReply = {
  user: TUser;
  reply: string;
  _id: string;
};

export type TComment = {
  _id: string;
  user: TUser;
  product: string;
  likes: string[];
  comment: string;
  replies: TReply[];
  createdAt: string;
  updatedAt: string;
  isExpanded?: boolean;
};

export type TProduct = {
  _id: string;
  title: string;
  comments: TComment[];
};

export type TCommentActions = {
  toggleExpand: (commentId: string) => void;
  likeComment: (commentId: string) => void;
  replyToComment: (commentId: string, replyText: string) => void;
};

export type TProductActions = {
  addComment: (productId: string, commentText: string) => void;
};

export interface AuctionNavBarProps {
  product: {
    mainPrice: any;
    _id: string;
    title: string;
    minBid: number;
    highestBid: string;
    endBid: string;
    totalComment: number;
    comments: any[];
    totalBids: number;
  };
  className?: string;
}

export interface BidInfoCardProps {
  productId: string;
  endBid: string;
  minBid: number;
  highestBid: number;
  seller: {
    name: string;
  };
}

export interface AuctionProductsProps  {
  isPaginate?: boolean;
  isShowAll?: boolean;
  isWinner?: boolean;
  isDraft?: boolean;
  isFeatured?: boolean;
  className?: string;
}
