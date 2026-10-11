import { NextResponse } from "next/server";

const getFileExtension = (contentType: string, url: string) => {
  if (contentType.includes("pdf")) return "pdf";
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";

  const extension = new URL(url).pathname.match(
    /\.(pdf|png|webp|gif|jpe?g)$/i,
  )?.[1];
  return extension?.toLowerCase() === "jpeg"
    ? "jpg"
    : extension?.toLowerCase() || "";
};

const findReportAssets = (value: unknown, baseUrl: string): URL[] => {
  const urls: URL[] = [];
  const seen = new Set<string>();
  const visit = (item: unknown, key = "") => {
    if (typeof item === "string") {
      const isAssetField =
        /^(url|href|src|pdf|pdfurl|download|downloadurl|file|fileurl|image|images|imageurl|photo|report|reporturl|link|sheet|auctionsheet)$/i.test(
          key.replace(/[_-]/g, ""),
        );
      const matches =
        item.match(/(?:https?:\/\/|\/)[^\s"'<>]+/gi) ||
        (isAssetField && item.trim() ? [item.trim()] : []);
      for (const match of matches) {
        try {
          const url = new URL(match.replace(/&amp;/g, "&"), baseUrl);
          const path = url.pathname.toLowerCase();
          const isKnownAsset =
            /\.(pdf|png|jpe?g|webp|gif)$/i.test(path) || isAssetField;
          if (
            isKnownAsset &&
            ["http:", "https:"].includes(url.protocol) &&
            !seen.has(url.toString())
          ) {
            seen.add(url.toString());
            urls.push(url);
          }
        } catch {
          // Ignore malformed URLs from the provider response.
        }
      }
      return;
    }

    if (Array.isArray(item)) {
      item.forEach((child) => visit(child, key));
    } else if (item && typeof item === "object") {
      Object.entries(item).forEach(([childKey, child]) =>
        visit(child, childKey),
      );
    }
  };

  visit(value);
  return urls.sort((a, b) => {
    const aIsPdf = /\.pdf$/i.test(a.pathname);
    const bIsPdf = /\.pdf$/i.test(b.pathname);
    return Number(bIsPdf) - Number(aIsPdf);
  });
};

const makeAttachment = (
  body: Uint8Array,
  contentType: string,
  url: string,
  chassis: string,
) => {
  const isPdf = new TextDecoder().decode(body.slice(0, 5)) === "%PDF-";
  const extension = isPdf ? "pdf" : getFileExtension(contentType, url);
  const canInferImageType =
    !contentType || contentType.includes("octet-stream");
  const resolvedContentType =
    contentType.includes("pdf") || isPdf
      ? "application/pdf"
      : contentType.startsWith("image/")
        ? contentType
        : canInferImageType
          ? (
              {
                jpg: "image/jpeg",
                png: "image/png",
                webp: "image/webp",
                gif: "image/gif",
              } as Record<string, string>
            )[extension] || ""
          : "";
  if (
    !extension ||
    !(
      resolvedContentType.includes("pdf") ||
      resolvedContentType.startsWith("image/")
    )
  ) {
    return null;
  }

  const filename = `auction-sheet-${chassis}.${extension}`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": resolvedContentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chassis = searchParams.get("chassis")?.trim();

    if (!chassis) {
      return NextResponse.json(
        { error: "Chassis parameter is required" },
        { status: 400 },
      );
    }

    const cleanChassis = chassis.replace(/[^A-Z0-9-]/gi, "");
    if (!cleanChassis) {
      return NextResponse.json(
        { error: "A valid chassis number is required" },
        { status: 400 },
      );
    }

    const apiCode =
      process.env.JPCENTER_API_CODE ||
      process.env.JPCENTER_API_KEY ||
      process.env.JPCENTER_CODE ||
      process.env.NEXT_PUBLIC_JPCENTER_CODE ||
      process.env.NEXT_PUBLIC_JPCENTER_API_CODE ||
      "3574926_42351f64ee17f62f8729d3d527c35dca";
    const baseUrl =
      process.env.JPCENTER_API_BASE_URL || "https://au.avto.jp/api/report";
    const lookupUrl = new URL(baseUrl);
    lookupUrl.searchParams.set("json", "");
    lookupUrl.searchParams.set("code", apiCode);
    lookupUrl.searchParams.set("chassis", cleanChassis);

    let lookupResponse = await fetch(lookupUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!lookupResponse.ok) {
      // Fallback to ajes.com
      const fallbackUrl = new URL("https://ajes.com/api/report");
      fallbackUrl.searchParams.set("json", "");
      fallbackUrl.searchParams.set("code", apiCode);
      fallbackUrl.searchParams.set("chassis", cleanChassis);
      lookupResponse = await fetch(fallbackUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(30000),
      }).catch(() => lookupResponse);
    }
    let lookupJson: any;
    try {
      lookupJson = await lookupResponse.json();
    } catch {
      return NextResponse.json(
        { error: "Failed to parse JPCenter lookup response" },
        { status: 502 },
      );
    }

    if (!lookupResponse.ok || lookupJson?.error) {
      return NextResponse.json(
        { error: lookupJson?.error || "JPCenter lookup failed" },
        { status: 502 },
      );
    }

    const records = Array.isArray(lookupJson?.aj)
      ? lookupJson.aj.filter(
          (record: any) => record && typeof record === "object",
        )
      : [];
    const record = records.find((item: any) => String(item.key || "").trim());

    if (!record?.key) {
      return NextResponse.json(
        {
          error:
            "Auction sheet is not available from JPCenter for this chassis",
        },
        { status: 404 },
      );
    }

    const reportUrl = new URL(baseUrl);
    reportUrl.searchParams.set("json", "");
    reportUrl.searchParams.set("code", apiCode);
    reportUrl.searchParams.set("chassis", cleanChassis);
    reportUrl.searchParams.set("key", record.key);

    const reportResponse = await fetch(reportUrl, {
      headers: {
        Accept: "application/json, application/pdf, image/*, text/html",
      },
      signal: AbortSignal.timeout(45000),
    });
    if (!reportResponse.ok) {
      return NextResponse.json(
        { error: "JPCenter report request failed" },
        { status: 502 },
      );
    }

    const reportBody = new Uint8Array(await reportResponse.arrayBuffer());
    const reportContentType = reportResponse.headers.get("content-type") || "";
    const directFile = makeAttachment(
      reportBody,
      reportContentType,
      reportUrl.toString(),
      cleanChassis,
    );
    if (directFile) return directFile;

    const reportText = new TextDecoder().decode(reportBody);
    let reportData: unknown;
    try {
      reportData = JSON.parse(reportText);
    } catch {
      reportData = reportText;
    }

    const assets = findReportAssets(reportData, reportUrl.toString());
    for (const asset of assets) {
      const assetResponse = await fetch(asset, {
        signal: AbortSignal.timeout(30000),
      });
      if (!assetResponse.ok) continue;

      const assetBody = new Uint8Array(await assetResponse.arrayBuffer());
      const contentType = assetResponse.headers.get("content-type") || "";
      const attachment = makeAttachment(
        assetBody,
        contentType,
        asset.toString(),
        cleanChassis,
      );
      if (attachment) return attachment;
    }

    return NextResponse.json(
      {
        error:
          "JPCenter returned the report but no downloadable sheet was found",
      },
      { status: 502 },
    );
  } catch (error: unknown) {
    console.error("JPCenter download error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
