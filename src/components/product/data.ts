const generateRandomId = (): string =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

const createRandomProduct = (): any => ({
  photos: {
    mainPhoto: `/placeholder.png`,
    others: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      () => `https://example.com/photos/others/${generateRandomId()}.jpg`,
    ),
    docs: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => `https://example.com/photos/docs/${generateRandomId()}.pdf`,
    ),
  },
  title: `Product Title ${Math.random().toString(36).substring(7)}`,
  make: ["Toyota", "Ford", "Tesla", "BMW", "Honda"][
    Math.floor(Math.random() * 5)
  ],
  model: ["Corolla", "F-150", "Model 3", "X5", "Civic"][
    Math.floor(Math.random() * 5)
  ],
  mileage: `${Math.floor(Math.random() * 100000)} km`,
  vin: Math.random().toString(36).substring(2, 17).toUpperCase(),
  titleStatus: [
    "clean (CT)",
    "salvage",
    "rebuilt/reconstructed",
    "junk",
    "buyback",
    "bonded",
    "export only",
    "odometer rollback",
    "flood",
    "non-repairable",
  ][Math.floor(Math.random() * 10)],
  location: {
    city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
      Math.floor(Math.random() * 5)
    ],
    zipCode: Math.floor(10000 + Math.random() * 89999),
  },
  seller: generateRandomId(),
  engine: ["V6", "V8", "Electric", "Hybrid", "I4"][
    Math.floor(Math.random() * 5)
  ],
  drivetrain: ["AWD", "FWD", "RWD"][Math.floor(Math.random() * 3)],
  transmission: ["automatic", "manual"][Math.floor(Math.random() * 2)],
  bodyStyle: [
    "coupe",
    "convertible",
    "hatchback",
    "sedan",
    "suv/crossover",
    "truck",
    "van/minivam",
    "wagon",
  ][Math.floor(Math.random() * 8)],
  launchingYear: Math.floor(1990 + Math.random() * 34),
  exteriorColor: ["red", "blue", "black", "white", "silver"][
    Math.floor(Math.random() * 5)
  ],
  interiorColor: ["tan", "gray", "black", "white", "beige"][
    Math.floor(Math.random() * 5)
  ],
  sellerType: ["dealer", "private"][Math.floor(Math.random() * 2)],
  highlights: Array.from(
    { length: Math.floor(Math.random() * 4) + 1 },
    () => `Highlight ${Math.random().toString(36).substring(7)}`,
  ),
  equipment: Array.from(
    { length: Math.floor(Math.random() * 4) + 1 },
    () => `Equipment ${Math.random().toString(36).substring(7)}`,
  ),
  modification: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => `Modification ${Math.random().toString(36).substring(7)}`,
  ),
  recentServiceHistory: Array.from(
    { length: Math.floor(Math.random() * 3) },
    () => `Service ${Math.random().toString(36).substring(7)}`,
  ),
  otherItemsIncludedInSale: Array.from(
    { length: Math.floor(Math.random() * 3) },
    () => `Item ${Math.random().toString(36).substring(7)}`,
  ),
  ownershipHistory: `Ownership history for ${Math.random().toString(36).substring(7)}`,
  sellerNotes: Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => `Note ${Math.random().toString(36).substring(7)}`,
  ),
  videos: Array.from(
    { length: Math.floor(Math.random() * 2) },
    () => `https://example.com/video/${generateRandomId()}.mp4`,
  ),
  views: Math.floor(Math.random() * 5000),
  bids: {
    bidsHistory: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({
      buyer: generateRandomId(),
      amount: Math.floor(500 + Math.random() * 4500),
      biddingTime: new Date(),
    })),
    biddingDuration: {
      startBid: new Date(),
      endBid: new Date(Date.now() + Math.floor(Math.random() * 1000000000)),
    },
    minBid: 500,
    maxBid: 5000,
  },
});

export const mockProducts: any[] = Array.from(
  { length: 20 },
  createRandomProduct,
);
