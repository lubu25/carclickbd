interface TBid {
    [x: string]: any;
    _id: string;
    buyer: {
      _id: string;
      name: string;
      profilePhoto: string;
    };
    product: {
      _id: string;
      title: string;
      photos: {
        mainPhoto: string;
      };
      make: string;
      model: string;
    };
    winner: {
      id: string;
      name: string;
      photo: string;
    },
    highestBidder: {
      id: string;
      name: string;
      photo: string;
    }
    bidAmount: string;
    createdAt: string;
    highestBid: string;
  }