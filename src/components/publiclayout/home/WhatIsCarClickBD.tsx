"use client";
import React from "react";
import Button from "@/components/shared/PrimaryButton";

const WhatIsCarClickBD = () => {
  const cards = [
    {
      title: "Wholesale Vehicles",
      image: "https://www.copart.com/content/copart-select-4grid.png",
      items: [
        "Normal Wear",
        "Minor Dents/Scratches",
        "Hail Damage",
        "Minor Mechanical",
        "Latest Models",
        "Low Mileage",
      ],
    },
    {
      title: "Automobiles",
      image: "https://www.copart.com/content/us/en/images/automobiles.png",
      items: ["Sedans", "Hatchbacks", "Convertibles", "Crossovers", "Coupes", "Sports"],
    },
    {
      title: "Trucks",
      image: "https://www.copart.com/content/us/en/images/trucks.png",
      items: ["Pickups", "Box", "Cargo", "Flatbeds", "Delivery", "Freightliners"],
    },
    {
      title: "Motorcycles",
      image: "https://www.copart.com/content/us/en/images/motorcycles.png",
      items: ["Standards", "Cruisers", "Sport Tourings", "Tourings", "Scooters", "Motorcross"],
    },
  ];

  return (
    <section className="bg-slate-950 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-lg px-4 md:px-8 lg:grid-cols-[0.82fr_1.18fr]">
      {/* ===== Left Section (40%) ===== */}
      <div className="bg-[#181818] text-white p-8 lg:p-12">
        <h2 className="text-3xl font-bold mb-6">What is CarClickBD?</h2>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          <span className="text-[#F0B90B] font-semibold">CarClickBD</span> is an innovative online
          car marketplace designed to make buying and selling vehicles easier,
          faster, and more transparent for everyone. From car enthusiasts and small business
          owners to professional dealers, CarClickBD offers a single, trusted platform to
          connect buyers and sellers around the world.
        </p>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          We specialize in a wide range of listings including{" "}
          <span className="text-[#F0B90B] font-semibold">
            new cars, reconditioned cars, local used cars, motorcycles, trucks, and SUVs
          </span>
          . Every week, verified vehicles are listed by dealers and private sellers, each
          with detailed condition reports, clear photos, and accurate documentation so you
          can inquire with confidence.
        </p>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          What makes CarClickBD unique is its accessibility. Dealers can manage inventory,
          private sellers can upload up to 40 photos, and buyers can contact sellers directly
          through inquiries and WhatsApp. Our marketplace makes purchasing cars simple,
          secure, and cost-effective.
        </p>

        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          Whether you’re buying your first car, expanding your fleet, or restoring classics,
          CarClickBD provides all the tools you need: smart filters, watchlists, vehicle alerts,
          finance tools, TRUE REPORT support, and easy online payments. You can search,
          compare, save favorites, and inquire from your phone or computer.
        </p>

        <p className="text-gray-300 text-sm leading-relaxed mb-8">
          By combining technology with transparency, CarClickBD gives buyers more control and
          sellers more visibility. Join our growing community of members today to experience{" "}
          <span className="text-[#F0B90B] font-semibold">
            the next generation of digital vehicle trading
          </span>{" "}
          — where trust, speed, and value come together.
        </p>

        <Button
          variant="secondary"
          size="md"
          className="rounded-full font-semibold px-8 py-3 text-sm"
        >
          BECOME A MEMBER
        </Button>
      </div>

      {/* ===== Right Section (60%) ===== */}
      <div className="bg-[#002b8f] text-white p-8 lg:p-12">
        <h3 className="text-xl lg:text-2xl font-semibold mb-10 text-center lg:text-left">
          Search CarClickBD’s Extensive Used & Repairable Cars for Sale
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#0b3fb3] rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,100,255,0.4)]"
            >
              {/* Image Header */}
              <div className="relative mb-4">
                <img
                  src={card.image}
                  alt={card.title}
                  className="rounded-lg border border-white/20 w-full h-24 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                <div className="absolute bottom-3 left-4">
                  <h4 className="text-lg font-semibold">{card.title}</h4>
                  <p className="text-sm text-gray-200">Search Now ›</p>
                </div>
              </div>

              {/* Two-column bullet list */}
              <div className="grid grid-cols-2 gap-x-4 text-[14px] text-gray-200">
                {card.items.map((item, i) => (
                  <p
                    key={i}
                    className="flex items-center gap-1 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="text-[#F0B90B]">•</span>
                    {item}›
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default WhatIsCarClickBD;
