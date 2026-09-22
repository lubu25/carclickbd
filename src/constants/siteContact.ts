export const siteContact = {
  company: "NEXUS TRADING",
  brand: "CarClickBD",
  email: "carclickbd@gmail.com",
  whatsapp: "+8801576611703",
  whatsappDigits: "8801576611703",
  addressLines: [
    "19, TOPKHANA ROAD, SHAHBAG THANA",
    "DHAKA-1000",
  ],
  mapQuery: "19 Topkhana Road, Shahbag Thana, Dhaka 1000",
};

export const siteAddress = `${siteContact.company}, ${siteContact.addressLines.join(", ")}`;

export const getWhatsAppUrl = (message = "Hello! I have a question about CarClickBD") =>
  `https://wa.me/${siteContact.whatsappDigits}?text=${encodeURIComponent(message)}`;
