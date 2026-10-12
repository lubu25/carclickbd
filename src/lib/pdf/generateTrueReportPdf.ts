import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

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

async function fetchImageBuffer(
  url: string,
): Promise<{ buffer: Buffer; format: "JPEG" | "PNG" } | null> {
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
      buffer: buf,
      format: url.toLowerCase().includes(".png") ? "PNG" : "JPEG",
    };
  } catch {
    return null;
  }
}

function getLocalLogoDataUrl(): string | null {
  try {
    const candidates = [
      path.join(process.cwd(), "public", "assets", "logo.png"),
      path.join(process.cwd(), "src", "assets", "logo.png"),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        return `data:image/png;base64,${buf.toString("base64")}`;
      }
    }
  } catch {}
  return null;
}

export async function generateTrueReportPdf(
  data: TrueReportPdfData,
  chassis: string,
): Promise<Uint8Array> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm

  // Generate QR Code linking to online verification report
  const qrTargetUrl = `https://carclickbd.com/auction-sheets?status=success&chassis=${encodeURIComponent(chassis)}`;
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(qrTargetUrl, { margin: 1, width: 256 });
  } catch (err) {
    console.warn("Could not generate QR code:", err);
  }

  // 1. TOP HEADER (Logo on left, Red Title on right)
  const logoDataUrl = getLocalLogoDataUrl();
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", 10, 8, 48, 14, undefined, "FAST");
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(192, 0, 0);
    doc.text("CarClick BD", 10, 18);
  }

  doc.setFont("times", "bolditalic");
  doc.setFontSize(15);
  doc.setTextColor(192, 0, 0); // #c00000 red
  doc.text(`True Report of ${chassis}`, pageWidth - 10, 18, {
    align: "right",
  });

  // 2. LEFT COLUMN: Specifications Table (x=10, width=54)
  const leftX = 10;
  const leftW = 54;

  // Header Box
  doc.setFillColor(178, 102, 16); // #b26610 (Amber / Golden Brown)
  doc.rect(leftX, 26, leftW, 13, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("TRUE REPORT", leftX + leftW / 2, 32, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(chassis, leftX + leftW / 2, 37, { align: "center" });

  const specsRows: [string, string][] = [
    ["Auction", data.auction || "N/A"],
    ["Auction date", data.auctionDate || "N/A"],
    ["Lot number", data.lotNumber || "N/A"],
    ["Frame", data.chassisId || chassis],
    ["Vendor", data.brand || data.vendor || "TOYOTA"],
    ["Model", data.model || "N/A"],
    ["Mileage", data.mileage || "N/A"],
    [
      "Displacement",
      data.engineCc
        ? `${data.engineCc}`.includes("cc")
          ? data.engineCc
          : `${data.engineCc}`
        : "N/A",
    ],
    ["Year", data.year || "N/A"],
    ["Grade", data.grade || "N/A"],
    ["Equipment", data.equipment || "AAC"],
    ["Transmission", data.transmission || "N/A"],
    ["Color", data.color || "N/A"],
    ["Score", data.condition || "N/A"],
    ["Status", (data.status || "SOLD").toUpperCase()],
    ["Powered By", "CARCLICK BD"],
  ];

  const startY = 39;
  const rowH = 6.4;
  specsRows.forEach((r, idx) => {
    const y = startY + idx * rowH;
    // Row background
    doc.setFillColor(
      idx % 2 === 0 ? 255 : 248,
      idx % 2 === 0 ? 255 : 250,
      idx % 2 === 0 ? 255 : 252,
    );
    doc.rect(leftX, y, leftW, rowH, "F");
    // Row border
    doc.setDrawColor(226, 232, 240);
    doc.rect(leftX, y, leftW, rowH, "S");

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(71, 85, 105);
    doc.text(r[0], leftX + 2, y + 4.5);

    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    if (r[0] === "Powered By") {
      doc.setTextColor(192, 0, 0); // Powered by CarClick BD in Red
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(String(r[1]), leftX + 22, y + 4.5);
  });

  // 3. MIDDLE COLUMN: Japanese Auction Sheet (x=66, width=72, height=115)
  const midX = 66;
  const midW = 72;
  const midH = 115;
  doc.setDrawColor(203, 213, 225);
  doc.rect(midX, 26, midW, midH, "S");

  if (data.auctionSheetImage) {
    const sheetImg = await fetchImageBuffer(data.auctionSheetImage);
    if (sheetImg) {
      doc.addImage(
        sheetImg.buffer,
        sheetImg.format,
        midX + 0.5,
        26.5,
        midW - 1,
        midH - 1,
        undefined,
        "FAST",
      );
    }
  }

  // 4. RIGHT COLUMN: Auction Sheet Explanation (x=140, width=60)
  const rightX = 140;
  doc.setFont("times", "bolditalic");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Auction Sheet Explanation", rightX, 31);
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(rightX, 32.5, rightX + 60, 32.5);

  const explanations = [
    { text: "A1 : Small Scratch | A2 : Scratch | A3 : Big Scratch" },
    { text: "B1 : Small dent with scratch (size like a thumb)" },
    { text: "B2 : Dent with scratch (size like flat of the hand)" },
    { text: "B3 : Big Dent with scratch (size like elbow)" },
    { text: "C1: Corrosion | C2: Heavy Corrosion" },
    { text: "E1: Few Dimples | E2: Several Dimples" },
    { text: "E3: Many Dimples | G: Chip In Glass" },
    { text: "H: Paint faded | X: Need to be replaced" },
    { text: "P: Paint Marked | R: Repaired Crack on Windshield" },
    { text: "RX: Repaired Crack on Windshield (needs to be replaced)" },
    { text: "S1: Rust | S2: Heavy Rust" },
    { text: "U1: Small Dent | U2: Dent | U3: Big Dent" },
    { text: "X: Crack on Windshield (needs to be replaced)" },
    { text: "XX: Replaced" },
    { text: "X1: Small Crack on Windshield (approximately 1cm)" },
    { text: "W1: Repair Mark/Wave (hardly detectable )" },
    { text: "W2: Repair Mark/Wave" },
    { text: "W3: Obvious Repair Mark/Wave (needs to be repainted)" },
    {
      text: "Y1: Small Hole or Crack | Y2: Hole or Crack | Y3: Big Hole or Crack",
    },
  ];

  let expY = 37;
  explanations.forEach((item) => {
    if (item.text.includes("|")) {
      const parts = item.text.split("|");
      let curX = rightX;
      parts.forEach((p, pIdx) => {
        const seg = p.trim();
        const colonIdx = seg.indexOf(":");
        if (colonIdx !== -1) {
          const code = seg.substring(0, colonIdx + 1) + " ";
          const desc = seg.substring(colonIdx + 1).trim();
          doc.setFont("helvetica", "bold");
          doc.setFontSize(5.8);
          doc.setTextColor(192, 0, 0); // Red symbol code
          doc.text(code, curX, expY);
          curX += doc.getTextWidth(code);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 41, 59);
          doc.text(desc, curX, expY);
          curX += doc.getTextWidth(desc);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(5.8);
          doc.setTextColor(30, 41, 59);
          doc.text(seg, curX, expY);
          curX += doc.getTextWidth(seg);
        }
        if (pIdx < parts.length - 1) {
          doc.setTextColor(100, 116, 139);
          doc.text(" | ", curX, expY);
          curX += doc.getTextWidth(" | ");
        }
      });
    } else {
      const colonIdx = item.text.indexOf(":");
      if (colonIdx !== -1) {
        const code = item.text.substring(0, colonIdx + 1) + " ";
        const desc = item.text.substring(colonIdx + 1).trim();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5.8);
        doc.setTextColor(192, 0, 0); // Red symbol code
        doc.text(code, rightX, expY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(desc, rightX + doc.getTextWidth(code), expY);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5.8);
        doc.setTextColor(30, 41, 59);
        doc.text(item.text, rightX, expY);
      }
    }
    expY += 5.4;
  });

  // 5. BOTTOM SECTION: Car Photos & QR Code (Y = 145mm)
  const bottomY = 145;
  const photoW = 60;
  const photoH = 46;

  // Car Photo 1 (Front View)
  if (data.carImages && data.carImages[0]) {
    const photo1 = await fetchImageBuffer(data.carImages[0]);
    if (photo1) {
      doc.setDrawColor(203, 213, 225);
      doc.rect(10, bottomY, photoW, photoH, "S");
      doc.addImage(
        photo1.buffer,
        photo1.format,
        10.5,
        bottomY + 0.5,
        photoW - 1,
        photoH - 1,
        undefined,
        "FAST",
      );
    }
  }

  // Car Photo 2 (Rear View)
  if (data.carImages && data.carImages[1]) {
    const photo2 = await fetchImageBuffer(data.carImages[1]);
    if (photo2) {
      doc.setDrawColor(203, 213, 225);
      doc.rect(73, bottomY, photoW, photoH, "S");
      doc.addImage(
        photo2.buffer,
        photo2.format,
        73.5,
        bottomY + 0.5,
        photoW - 1,
        photoH - 1,
        undefined,
        "FAST",
      );
    }
  }

  // QR Code on right side of bottom section
  if (qrDataUrl) {
    doc.setDrawColor(203, 213, 225);
    doc.rect(136, bottomY, 46, 46, "S");
    doc.addImage(qrDataUrl, "PNG", 136.5, bottomY + 0.5, 45, 45, undefined, "FAST");
  }

  // 6. FOOTER (Y = 282mm)
  const footerY = 282;
  doc.setDrawColor(192, 0, 0); // Red line
  doc.setLineWidth(0.5);
  doc.line(10, footerY, pageWidth - 10, footerY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(192, 0, 0);
  doc.text("A product by https://carclickbd.com/", 10, footerY + 5);

  doc.setFont("times", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Page 1 of 1", pageWidth - 10, footerY + 5, { align: "right" });

  return new Uint8Array(doc.output("arraybuffer"));
}
