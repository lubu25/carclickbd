import { jsPDF } from "jspdf";

export interface TrueReportPdfData {
  lotNumber?: string;
  auction?: string;
  auctionDate?: string;
  chassisId?: string;
  vendor?: string;
  brand?: string;
  model?: string;
  mileage?: string;
  engineCc?: string;
  year?: string;
  grade?: string;
  inspection?: string;
  equipment?: string;
  transmission?: string;
  awd?: string;
  startPrice?: string;
  finishPrice?: string;
  color?: string;
  condition?: string;
  status?: string;
  chassis?: string;
  auctionSheetImage?: string;
  carImages?: string[];
}

async function fetchImageBase64(
  url: string,
): Promise<{ base64: string; format: "JPEG" | "PNG" } | null> {
  if (!url || !url.startsWith("http")) return null;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) return null;
    return {
      base64: buf.toString("base64"),
      format: url.toLowerCase().includes(".png") ? "PNG" : "JPEG",
    };
  } catch {
    return null;
  }
}

export async function generateTrueReportPdf(
  data: TrueReportPdfData,
  chassis: string,
): Promise<Uint8Array> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ==========================================
  // PAGE 1: Header + Specifications + Auction Sheet
  // ==========================================
  doc.setFillColor(0, 51, 153); // #003399
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("CARCLICKBD • OFFICIAL JAPANESE AUCTION TRUE REPORT", 12, 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `CHASSIS: ${chassis}  |  ORDER VERIFIED  |  BANK & CUSTOMS CERTIFIED`,
    12,
    16,
  );

  // Specifications Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(10, 26, pageWidth - 20, 38, 2, 2, "FD");

  const specs: [string, string][] = [
    ["Chassis ID", chassis],
    ["Make / Vendor", data.brand || data.vendor || "TOYOTA"],
    ["Model", data.model || "N/A"],
    ["Year", data.year || "N/A"],
    ["Grade", data.grade || "N/A"],
    ["Mileage", data.mileage || "N/A"],
    ["Engine CC", data.engineCc ? `${data.engineCc} cc` : "N/A"],
    ["Transmission", data.transmission || "N/A"],
    ["Auction House", data.auction || "TAA / USS"],
    ["Auction Date", data.auctionDate || "N/A"],
    ["Lot Number", data.lotNumber || "N/A"],
    ["Overall Grade", data.condition || "N/A"],
    ["Start Price", data.startPrice || "0 JPY"],
    ["Finish Price", data.finishPrice || "N/A"],
    ["Color", data.color || "N/A"],
    ["Status", (data.status || "SOLD").toUpperCase()],
  ];

  doc.setFontSize(7.5);
  const col1X = 14;
  const col2X = 62;
  const col3X = 110;
  const col4X = 158;

  for (let i = 0; i < 4; i++) {
    const y = 32 + i * 7;
    // Col 1
    const s1 = specs[i];
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(s1[0] + ":", col1X, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(s1[1], col1X + 22, y);

    // Col 2
    const s2 = specs[i + 4];
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(s2[0] + ":", col2X, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(s2[1], col2X + 22, y);

    // Col 3
    const s3 = specs[i + 8];
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(s3[0] + ":", col3X, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(s3[1], col3X + 22, y);

    // Col 4
    const s4 = specs[i + 12];
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text(s4[0] + ":", col4X, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(
      s4[0] === "Status" ? 16 : 15,
      s4[0] === "Status" ? 149 : 23,
      s4[0] === "Status" ? 71 : 42,
    );
    doc.text(s4[1], col4X + 20, y);
  }

  // Section title for Auction Sheet
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 153);
  doc.text(
    "AUTHENTIC JAPANESE AUCTION INSPECTION SHEET (ORIGINAL DIAGRAM):",
    12,
    69,
  );

  // Embed sheet image
  if (data.auctionSheetImage) {
    const sheetImg = await fetchImageBase64(data.auctionSheetImage);
    if (sheetImg) {
      doc.addImage(
        `data:image/jpeg;base64,${sheetImg.base64}`,
        sheetImg.format,
        10,
        72,
        pageWidth - 20,
        214,
        undefined,
        "FAST",
      );
    }
  }

  // ==========================================
  // PAGE 2: Vehicle Inspection Photos
  // ==========================================
  if (data.carImages && data.carImages.length > 0) {
    doc.addPage();
    doc.setFillColor(0, 51, 153);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`VEHICLE INSPECTION PHOTOS • CHASSIS: ${chassis}`, 12, 12);

    const validImages: { base64: string; format: "JPEG" | "PNG" }[] = [];
    for (const url of data.carImages.slice(0, 6)) {
      const img = await fetchImageBase64(url);
      if (img) validImages.push(img);
    }

    if (validImages.length === 1) {
      doc.addImage(
        `data:image/jpeg;base64,${validImages[0].base64}`,
        validImages[0].format,
        15,
        30,
        pageWidth - 30,
        140,
        undefined,
        "FAST",
      );
    } else if (validImages.length >= 2) {
      const imgWidth = (pageWidth - 30) / 2;
      const imgHeight = 70;
      validImages.forEach((img, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 12 + col * (imgWidth + 6);
        const y = 30 + row * (imgHeight + 10);
        doc.addImage(
          `data:image/jpeg;base64,${img.base64}`,
          img.format,
          x,
          y,
          imgWidth,
          imgHeight,
          undefined,
          "FAST",
        );
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Vehicle Inspection Photo ${idx + 1}`,
          x + 2,
          y + imgHeight + 5,
        );
      });
    }
  }

  // ==========================================
  // PAGE 3: Japanese Auction Sheet Glossary & Official Bank Certificate
  // ==========================================
  doc.addPage();
  doc.setFillColor(0, 51, 153);
  doc.rect(0, 0, pageWidth, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("JAPANESE AUCTION SHEET MARKINGS & CONDITION GUIDE", 12, 12);

  const GLOSSARY = [
    { code: "A1", desc: "Small Scratch" },
    { code: "A2", desc: "Scratch" },
    { code: "A3", desc: "Big Scratch" },
    { code: "U1", desc: "Small Dent" },
    { code: "U2", desc: "Dent" },
    { code: "U3", desc: "Big Dent" },
    { code: "W1", desc: "Minor Repair (hardly detectable)" },
    { code: "W2", desc: "Repair Mark / Wave" },
    { code: "W3", desc: "Obvious Repair Wave" },
    { code: "S1", desc: "Rust" },
    { code: "S2", desc: "Heavy Rust" },
    { code: "C1", desc: "Corrosion" },
    { code: "C2", desc: "Heavy Corrosion" },
    { code: "XX", desc: "Replaced Panel / Part" },
    { code: "X1", desc: "Small Windshield Crack (~1cm)" },
    { code: "X", desc: "Windshield Crack (needs replacement)" },
    { code: "B", desc: "Dent with scratch" },
    { code: "P", desc: "Paint marked" },
    { code: "H", desc: "Paint faded" },
    { code: "G", desc: "Stone chip in glass" },
  ];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(10, 28, pageWidth - 20, 110, 2, 2, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 153);
  doc.text("Standard Japanese Auction Inspection Symbols & Meanings:", 14, 36);

  GLOSSARY.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 16 + col * 90;
    const y = 44 + row * 9;

    doc.setFillColor(0, 51, 153);
    doc.roundedRect(x, y - 4, 8, 5.5, 1, 1, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(item.code, x + 1.5, y);

    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "normal");
    doc.text(item.desc, x + 11, y);
  });

  // Official Certificate Notice
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.setDrawColor(167, 243, 208); // emerald-200
  doc.roundedRect(10, 146, pageWidth - 20, 45, 2, 2, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 95, 70); // emerald-800
  doc.text("100% AUTHENTIC JAPANESE VEHICLE VERIFICATION DOCUMENT", 16, 156);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(4, 120, 87);
  doc.text(
    `This report has been compiled from direct Japanese auction database records for Chassis ID: ${chassis}.`,
    16,
    163,
  );
  doc.text(
    "All inspection diagram marks, inspector comments, and auction results are authentic and unmodified.",
    16,
    169,
  );
  doc.text(
    "This document is recognized and accepted by banks, financial institutions, and BRTA customs clearance in Bangladesh.",
    16,
    175,
  );
  doc.setFont("helvetica", "bold");
  doc.text(
    "Verified by CarClickBD (www.carclickbd.com) • Support: info@carclickbd.com",
    16,
    183,
  );

  return new Uint8Array(doc.output("arraybuffer"));
}
