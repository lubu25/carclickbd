
export const getHighestOrMinimumBid = (bidInfo: any): number => {
  const minBid = Number(bidInfo?.minBid || 0);
  const highestBid = Number(bidInfo?.highestBid || 0);

  return Math.max(highestBid, minBid );
};
