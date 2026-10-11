import { NextRequest, NextResponse } from "next/server";

const API_CODE =
  process.env.JPCENTER_API_CODE ||
  process.env.JPCENTER_API_KEY ||
  process.env.JPCENTER_CODE ||
  process.env.NEXT_PUBLIC_JPCENTER_CODE ||
  "3574926_42351f64ee17f62f8729d3d527c35dca";

const HOSTS = [
  "https://au.avto.jp/api/report",
  "https://ajes.com/api/report",
  "https://jpcenter.ru/api/report",
];

async function fetchFromHosts(urlBuilder: (host: string) => string) {
  let lastErrorText = "";
  let lastStatus = 500;

  for (const host of HOSTS) {
    try {
      const url = urlBuilder(host);
      const res = await fetch(url, {
        headers: {
          Accept: "text/xml, application/xml, text/plain",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(15000),
      });

      const text = await res.text();

      // Check if host returned anti-bot challenge or block
      if (
        text.includes("allow_ip_ai") ||
        text.includes("support@ajes.com") ||
        text.includes("draggableCircle")
      ) {
        lastErrorText = text;
        lastStatus = 403;
        continue;
      }

      if (res.ok && (text.includes("<aj>") || text.includes("<row>") || text.includes("<report>") || text.includes("<error>"))) {
        return { text, ok: true, status: res.status };
      }

      lastErrorText = text;
      lastStatus = res.status;
    } catch (err: any) {
      lastErrorText = err.message;
    }
  }

  return { text: lastErrorText, ok: false, status: lastStatus };
}

function extractTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : "";
}

function parseLookupXml(xmlText: string, chassis: string) {
  const notFound = xmlText.includes("<error>not found</error>") || xmlText.includes("<error>not_found</error>");
  if (notFound) {
    return {
      found: false,
      chassis,
      exactMatches: [],
      allMatches: [],
      report: [],
    };
  }

  const rowMatches = xmlText.match(/<row>[\s\S]*?<\/row>/gi) || [];
  const rows = rowMatches.map((rowXml) => {
    const colorTag = extractTag(rowXml, "color");
    const isExactMatch = colorTag === "3";

    return {
      id: extractTag(rowXml, "id"),
      key: extractTag(rowXml, "key"),
      colorTag,
      isExactMatch,
      image: extractTag(rowXml, "image"),
      imagesNum: parseInt(extractTag(rowXml, "images_num") || "1", 10),
      chassisId: extractTag(rowXml, "car_frame"),
      frame: extractTag(rowXml, "car_frame"),
      maker: extractTag(rowXml, "car_maker"),
      brand: extractTag(rowXml, "car_maker"),
      model: extractTag(rowXml, "car_model"),
      displacement: extractTag(rowXml, "car_displacement"),
      engineCc: extractTag(rowXml, "car_displacement"),
      year: extractTag(rowXml, "car_year"),
      grade: extractTag(rowXml, "car_grade"),
      inspection: extractTag(rowXml, "car_inspection"),
      options: extractTag(rowXml, "car_options"),
      equipment: extractTag(rowXml, "car_options"),
      transmission: extractTag(rowXml, "car_transmission"),
      startPrice: extractTag(rowXml, "car_start_price"),
      color: extractTag(rowXml, "car_color"),
      result: extractTag(rowXml, "car_result"),
      status: extractTag(rowXml, "car_result"),
    };
  });

  const exactMatches = rows.filter((r) => r.isExactMatch);
  const primaryList = exactMatches.length > 0 ? exactMatches : rows;

  return {
    found: rows.length > 0,
    chassis,
    matchCount: primaryList.length,
    exactMatchCount: exactMatches.length,
    exactMatches,
    allMatches: rows,
    report: primaryList,
    download_available: primaryList.length > 0,
    firstKey: primaryList[0]?.key || "",
  };
}

function parseFullReportXml(xmlText: string, chassis: string) {
  const reportMatches = xmlText.match(/<report>[\s\S]*?<\/report>/gi) || [];
  const reports = reportMatches.map((reportXml) => {
    const carImages: string[] = [];
    // Extract img1, img2, img3, ...
    for (let i = 1; i <= 30; i++) {
      const img = extractTag(reportXml, `img${i}`);
      if (img && img.startsWith("http")) {
        carImages.push(img);
      }
    }

    const sheetImage = extractTag(reportXml, "img0");
    if (!sheetImage && carImages.length > 0) {
      // fallback
    }

    return {
      lotNumber: extractTag(reportXml, "lot_number"),
      auction: extractTag(reportXml, "auction"),
      auctionDate: extractTag(reportXml, "auction_date"),
      chassisId: extractTag(reportXml, "chassis_ID"),
      vendor: extractTag(reportXml, "vendor"),
      brand: extractTag(reportXml, "vendor"),
      model: extractTag(reportXml, "model"),
      mileage: extractTag(reportXml, "mileage"),
      engineCc: extractTag(reportXml, "engine_CC"),
      year: extractTag(reportXml, "year"),
      grade: extractTag(reportXml, "grade"),
      inspection: extractTag(reportXml, "inspection"),
      equipment: extractTag(reportXml, "equipment"),
      transmission: extractTag(reportXml, "transmission"),
      awd: extractTag(reportXml, "awd"),
      startPrice: extractTag(reportXml, "start_price"),
      finishPrice: extractTag(reportXml, "finish_price"),
      color: extractTag(reportXml, "color"),
      condition: extractTag(reportXml, "condition"),
      status: extractTag(reportXml, "status"),
      chassis: extractTag(reportXml, "chassis") || chassis,
      auctionSheetImage: sheetImage,
      carImages,
    };
  });

  return {
    found: reports.length > 0,
    chassis,
    reportCount: reports.length,
    reports,
    keyForTranslate: extractTag(xmlText, "key_for_translate"),
    balance: extractTag(xmlText, "balance"),
    username: extractTag(xmlXmlClean(xmlText), "username"),
  };
}

function xmlXmlClean(str: string) {
  return str.replace(/&(?!amp;|lt;|gt;|apos;|quot;)/g, "&amp;");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chassis = searchParams.get("chassis")?.trim();
  const key = searchParams.get("key")?.trim();
  const isFull = searchParams.get("full") === "true";
  const format = searchParams.get("format");

  if (!chassis) {
    return NextResponse.json({ error: "Chassis is required" }, { status: 400 });
  }

  const cleanChassis = chassis.replace(/[^A-Z0-9-]/gi, "");

  try {
    // If full report is requested with key
    if (key || isFull) {
      let reportKey = key;

      // If full report requested but no key provided, do lookup first to get key
      if (!reportKey) {
        const lookupResult = await fetchFromHosts(
          (host) => `${host}?chassis=${encodeURIComponent(cleanChassis)}&code=${API_CODE}`
        );
        if (lookupResult.ok) {
          const parsedLookup = parseLookupXml(lookupResult.text, cleanChassis);
          reportKey = parsedLookup.firstKey;
        }
      }

      if (reportKey) {
        const reportResult = await fetchFromHosts(
          (host) =>
            `${host}?chassis=${encodeURIComponent(cleanChassis)}&code=${API_CODE}&key=${encodeURIComponent(
              reportKey!
            )}`
        );

        if (reportResult.ok) {
          if (format === "xml") {
            return new NextResponse(reportResult.text, {
              status: 200,
              headers: { "Content-Type": "text/xml" },
            });
          }

          const parsedReport = parseFullReportXml(reportResult.text, cleanChassis);
          return NextResponse.json({
            success: true,
            isFullReport: true,
            data: parsedReport,
            rawXml: reportResult.text,
          });
        }
      }
    }

    // Default: Lookup search
    const lookupResult = await fetchFromHosts(
      (host) => `${host}?chassis=${encodeURIComponent(cleanChassis)}&code=${API_CODE}`
    );

    if (!lookupResult.ok) {
      if (lookupResult.text.includes("support@ajes.com") || lookupResult.text.includes("allow_ip_ai")) {
        return NextResponse.json(
          {
            error: "IP_BLOCKED",
            message:
              "JPCenter / AjES IP verification required. Please unblock IP or contact support.",
          },
          { status: 403 }
        );
      }
      return new NextResponse(lookupResult.text, { status: lookupResult.status || 500 });
    }

    if (format === "xml") {
      return new NextResponse(lookupResult.text, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    const parsedData = parseLookupXml(lookupResult.text, cleanChassis);
    return NextResponse.json({
      success: true,
      data: parsedData,
      rawXml: lookupResult.text,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

