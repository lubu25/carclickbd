// Static data with added photo URLs
export const products: any[] = [
  {
    _id: "product1",
    title: "2015 BMW M4",
    comments: [
      {
        _id: "comment1",
        user: {
          _id: "user1",
          name: "John Doe",
          id: "user1",
          photo:
            "/placeholder.png",
        },
        product: "product1",
        likes: ["user2", "user3", "user4"],
        comment:
          "This M4 looks amazing! The performance and styling are incredible.",
        replies: [
          {
            user: {
              _id: "user2",
              name: "Jane Smith",
              id: "user2",
              photo:
                "/placeholder.png",
            },
            reply:
              "I agree, the color is stunning. Have you seen it in person?",
            _id: "reply1",
          },
          {
            user: {
              _id: "user3",
              name: "Mike Johnson",
              id: "user3",
              photo:
                "/placeholder.png",
            },
            reply: "The M4 is a beast on the track!",
            _id: "reply2",
          },
        ],
        createdAt: "2024-12-22T12:00:00.000Z",
        updatedAt: "2024-12-22T12:30:00.000Z",
      },
    ],
  },
  {
    _id: "product2",
    title: "2018 Porsche 911 GT3",
    comments: [
      {
        _id: "comment2",
        user: {
          _id: "user3",
          name: "Mike Johnson",
          id: "user3",
          photo:
            "/placeholder.png",
        },
        product: "product2",
        likes: ["user1", "user4"],
        comment: "Dream car right here! The GT3 is pure perfection.",
        replies: [
          {
            user: {
              _id: "user4",
              name: "Sarah Lee",
              id: "user4",
              photo:
                "/placeholder.png",
            },
            reply:
              "The sound of that flat-six engine is incredible. Pure music!",
            _id: "reply3",
          },
        ],
        createdAt: "2024-12-23T10:15:00.000Z",
        updatedAt: "2024-12-23T11:00:00.000Z",
      },
    ],
  },
  {
    _id: "product3",
    title: "2020 Tesla Model 3 Performance",
    comments: [
      {
        _id: "comment3",
        user: {
          _id: "user5",
          name: "Alex Chen",
          id: "user5",
          photo:
            "/placeholder.png",
        },
        product: "product3",
        likes: ["user2", "user3"],
        comment:
          "Electric performance at its finest. The instant torque is addictive!",
        replies: [
          {
            user: {
              _id: "user1",
              name: "John Doe",
              id: "user1",
              photo:
                "/placeholder.png",
            },
            reply: "I'm impressed by the acceleration. It's mind-blowing!",
            _id: "reply4",
          },
        ],
        createdAt: "2024-12-24T09:30:00.000Z",
        updatedAt: "2024-12-24T10:45:00.000Z",
      },
    ],
  },
  {
    _id: "product4",
    title: "1967 Ford Mustang Fastback",
    comments: [
      {
        _id: "comment4",
        user: {
          _id: "user4",
          name: "Sarah Lee",
          id: "user4",
          photo:
            "/placeholder.png",
        },
        product: "product4",
        likes: ["user1", "user3", "user5"],
        comment:
          "A true classic! They really don't make them like this anymore.",
        replies: [
          {
            user: {
              _id: "user5",
              name: "Alex Chen",
              id: "user5",
              photo:
                "/placeholder.png",
            },
            reply:
              "The restoration work on this Mustang is absolutely top-notch.",
            _id: "reply5",
          },
        ],
        createdAt: "2024-12-25T14:00:00.000Z",
        updatedAt: "2024-12-25T15:30:00.000Z",
      },
    ],
  },
];

export const myproducts: any[] = [
  {
    _id: "1",
    photos: {
      mainPhoto:
        "https://www.mbusa.com/content/dam/mb-nafta/us/myco/my25/eqb-class/cgt/2025-250W-EQB-SUV-CGT-DR.png",
      docs: ["/images/car1-doc1.jpg", "/images/car1-doc2.jpg"],
    },
    title: "2018 Tesla Model 3 Performance",
    make: "Tesla",
    model: "Model 3",
    mileage: "35,000",
    vin: "5YJ3E1EB1JF000001",
    titleStatus: "clean (CT)",
    location: {
      city: "San Francisco",
      zipCode: 94105,
    },
    seller: "60d5ecb4b176a71d8892d47e",
    engine: "Dual Motor Electric",
    drivetrain: "All-Wheel Drive",
    transmission: "automatic",
    bodyStyle: "sedan",
    launchingYear: 2018,
    exteriorColor: "Red Multi-Coat",
    interiorColor: "Black",
    highlights: ["Autopilot", "Premium Interior", "Performance Upgrade"],
    equipment: ['19" Sport Wheels', "Glass Roof", "Premium Audio"],
    modification: [],
    ownershipHistory: "Single Owner",
    sellerNotes: ["Excellent condition", "Full service history"],
  },
  {
    _id: "2",
    photos: {
      mainPhoto:
        "https://www.mbusa.com/content/dam/mb-nafta/us/myco/my25/eqb-class/cgt/2025-250W-EQB-SUV-CGT-DR.png",
      docs: ["/images/car2-doc1.jpg"],
    },
    title: "2019 Porsche 911 Carrera S",
    make: "Porsche",
    model: "911",
    mileage: "12,500",
    vin: "WP0AB2A92KS123456",
    titleStatus: "clean (CT)",
    location: {
      city: "Los Angeles",
      zipCode: 90001,
    },
    seller: "60d5ecb4b176a71d8892d47f",
    engine: "3.0L Twin-Turbo Flat-6",
    drivetrain: "Rear-Wheel Drive",
    transmission: "automatic",
    bodyStyle: "coupe",
    launchingYear: 2019,
    exteriorColor: "GT Silver Metallic",
    interiorColor: "Black/Bordeaux Red",
    highlights: ["Sport Chrono Package", "PASM Sport Suspension"],
    equipment: ['20/21" RS Spyder Design Wheels', "Sport Exhaust System"],
    modification: [],
    ownershipHistory: "Single Owner",
    sellerNotes: ["Like new condition", "Garage kept"],
  },
  {
    _id: "3",
    photos: {
      mainPhoto:
        "https://www.mbusa.com/content/dam/mb-nafta/us/myco/my25/eqb-class/cgt/2025-250W-EQB-SUV-CGT-DR.png",
      docs: ["/images/car3-doc1.jpg", "/images/car3-doc2.jpg"],
    },
    title: "2020 Ford Mustang Shelby GT500",
    make: "Ford",
    model: "Mustang",
    mileage: "5,000",
    vin: "1FA6P8SJ5L5500001",
    titleStatus: "clean (CT)",
    location: {
      city: "Detroit",
      zipCode: 48201,
    },
    seller: "60d5ecb4b176a71d8892d480",
    engine: "5.2L Supercharged V8",
    drivetrain: "Rear-Wheel Drive",
    transmission: "manual",
    bodyStyle: "coupe",
    launchingYear: 2020,
    exteriorColor: "Twister Orange",
    interiorColor: "Ebony",
    highlights: ["Carbon Fiber Track Pack", "760 Horsepower"],
    equipment: ["Michelin Pilot Sport Cup 2 tires", "Recaro seats"],
    modification: [],
    ownershipHistory: "Single Owner",
    sellerNotes: ["Track day ready", "Never raced"],
  },
  {
    _id: "4",
    photos: {
      mainPhoto:
        "https://www.mbusa.com/content/dam/mb-nafta/us/myco/my25/eqb-class/cgt/2025-250W-EQB-SUV-CGT-DR.png",
      docs: ["/images/car4-doc1.jpg"],
    },
    title: "2021 Audi RS6 Avant",
    make: "Audi",
    model: "RS6",
    mileage: "8,700",
    vin: "WUAKBAF29MN123456",
    titleStatus: "clean (CT)",
    location: {
      city: "New York",
      zipCode: 10001,
    },
    seller: "60d5ecb4b176a71d8892d481",
    engine: "4.0L Twin-Turbo V8",
    drivetrain: "All-Wheel Drive",
    transmission: "automatic",
    bodyStyle: "wagon",
    launchingYear: 2021,
    exteriorColor: "Nardo Gray",
    interiorColor: "Black",
    highlights: ["591 Horsepower", "Adaptive Air Suspension"],
    equipment: [
      '22" 5-V-spoke trapezoid design wheels',
      "Bang & Olufsen 3D Sound System",
    ],
    modification: [],
    ownershipHistory: "Single Owner",
    sellerNotes: [
      "Perfect family performance car",
      "All service records available",
    ],
  },
];

export const bids = [
  {
    buyer: { name: "John Doe", photo: "https://example.com/photo1.jpg" },
    product: "1",
    bidAmount: "150.00",
  },
  {
    buyer: { name: "Jane Smith", photo: "https://example.com/photo2.jpg" },
    product: "2",
    bidAmount: "200.00",
  },
  {
    buyer: { name: "Alice Brown", photo: "https://example.com/photo3.jpg" },
    product: "3",
    bidAmount: "175.00",
  },
  {
    buyer: { name: "Bob Green", photo: "https://example.com/photo4.jpg" },
    product: "4",
    bidAmount: "220.00",
  },
];

export const fallbackProfileUrl =
  "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";
export const fallbackProductUrl =
  "https://shop.roadster.com/assets/car-placeholder-652ae305f4b4afc9eb5f2d976fa0f77979069acb686b0a16fcc062e210367660.png";
