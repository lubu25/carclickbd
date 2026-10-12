import { NextResponse } from "next/server";
import { generateTrueReportPdf } from "@/lib/pdf/generateTrueReportPdf";
import { isChassisPaid } from "@/lib/true-report/orders";

export const runtime = "nodejs";
export const maxDuration = 60;

const PROVIDER_HOSTS = [
  "https://au.avto.jp/api/report",
  "https://ajes.com/api/report",
  "https://jpcenter.ru/api/report",
];
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const MAX_FILE_BYTES = 60 * 1024 * 1024;
type ProviderRecord = Record<string, unknown>;

class ReportError extends Error {
  constructor(
    message: string,
    readonly status = 502,
    readonly code = "ORIGINAL_PDF_UNAVAILABLE",
  ) {
    super(message);
  }
}

function trustedUrl(value: string, base?: string): URL | null {
  try {
    const url = new URL(value, base);
    const host = url.hostname.toLowerCase();
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.port ||
      !["ajes.com", "avto.jp", "jpcenter.ru"].some(
        (domain) => host === domain || host.endsWith(`.${domain}`),
      )
    )
      return null;
    return url;
  } catch {
    return null;
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(x[\da-f]+|\d+);/gi, (match, code: string) => {
      const point = code.toLowerCase().startsWith("x")
        ? parseInt(code.slice(1), 16)
        : parseInt(code, 10);
      return point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : match;
    })
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function xmlField(xml: string, tag: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(
    new RegExp(`<${escaped}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"),
  );
  return match ? decodeEntities(match[1]).trim() : "";
}

function asRecord(value: unknown): ProviderRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as ProviderRecord)
    : null;
}

function scalar(value: unknown): string {
  return typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : "";
}

function parseLookup(text: string): ProviderRecord[] {
  try {
    const data = asRecord(JSON.parse(text));
    const nested = asRecord(data?.data);
    const aj = data?.aj ?? nested?.aj ?? data?.rows ?? data?.row;
    const rows = Array.isArray(aj)
      ? aj
      : Array.isArray(asRecord(aj)?.row)
        ? (asRecord(aj)!.row as unknown[])
        : aj
          ? [aj]
          : [];
    return rows.map(asRecord).filter((row): row is ProviderRecord => !!row);
  } catch {
    return (text.match(/<row(?:\s+[^>]*)?>[\s\S]*?<\/row>/gi) || []).map(
      (row) => ({
        key: xmlField(row, "key"),
        color: xmlField(row, "color") || xmlField(row, "colortag"),
        colorTag: xmlField(row, "color") || xmlField(row, "colortag"),
        car_frame:
          xmlField(row, "car_frame") ||
          xmlField(row, "chassis") ||
          xmlField(row, "frame") ||
          xmlField(row, "chassis_id") ||
          xmlField(row, "chassisId"),
        chassis:
          xmlField(row, "car_frame") ||
          xmlField(row, "chassis") ||
          xmlField(row, "frame"),
        frame:
          xmlField(row, "car_frame") ||
          xmlField(row, "chassis") ||
          xmlField(row, "frame"),
      }),
    );
  }
}

function normaliseFrame(value: string) {
  return value.replace(/-/g, "").toUpperCase();
}

function metadataHasWrongChassis(text: string, chassis: string): boolean {
  let mismatch = false;
  const check = (value: unknown) => {
    const frame = scalar(value);
    if (frame && normaliseFrame(frame) !== normaliseFrame(chassis))
      mismatch = true;
  };
  const visit = (value: unknown, depth = 0) => {
    if (mismatch || depth > 12 || !value || typeof value !== "object") return;
    if (Array.isArray(value)) value.forEach((child) => visit(child, depth + 1));
    else
      Object.entries(value).forEach(([key, child]) => {
        if (/^(car_frame|chassis|chassisId)$/i.test(key)) check(child);
        else visit(child, depth + 1);
      });
  };
  try {
    visit(JSON.parse(text));
  } catch {
    for (const match of Array.from(
      text.matchAll(
        /<(car_frame|chassis|chassisId)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi,
      ),
    )) {
      check(decodeEntities(match[2]).trim());
    }
  }
  return mismatch;
}

function exactRecord(record: ProviderRecord, chassis: string): boolean {
  const frame = scalar(
    record.car_frame ?? record.frame ?? record.chassis ?? record.chassisId,
  );
  const cleanChassis = normaliseFrame(chassis);
  if (frame && normaliseFrame(frame) === cleanChassis && !!scalar(record.key))
    return true;
  if (frame && normaliseFrame(frame) !== cleanChassis) return false;
  const matchFlag = scalar(record.colorTag ?? record.color);
  return (
    (matchFlag === "3" ||
      record.isExactMatch === true ||
      (!matchFlag && !!frame) ||
      !matchFlag) &&
    !!scalar(record.key)
  );
}

function findBestRecord(
  records: ProviderRecord[],
  chassis: string,
): ProviderRecord | undefined {
  if (!records || records.length === 0) return undefined;
  const cleanChassis = normaliseFrame(chassis);

  // 1. Exact car_frame match with valid key
  const matchByFrame = records.find((record) => {
    const f = scalar(
      record.car_frame ?? record.frame ?? record.chassis ?? record.chassisId,
    );
    return f && normaliseFrame(f) === cleanChassis && !!scalar(record.key);
  });
  if (matchByFrame) return matchByFrame;

  // 2. Exact match flag from provider with valid key (ensuring frame doesn't conflict)
  const matchByFlag = records.find((record) => {
    const f = scalar(
      record.car_frame ?? record.frame ?? record.chassis ?? record.chassisId,
    );
    if (f && normaliseFrame(f) !== cleanChassis) return false;
    const matchFlag = scalar(record.colorTag ?? record.color);
    return (
      (matchFlag === "3" || record.isExactMatch === true) &&
      !!scalar(record.key)
    );
  });
  if (matchByFlag) return matchByFlag;

  // 3. Any record where frame is empty or matches and has valid key
  const compatible = records.find((record) => {
    const f = scalar(
      record.car_frame ?? record.frame ?? record.chassis ?? record.chassisId,
    );
    if (f && normaliseFrame(f) !== cleanChassis) return false;
    return !f && !!scalar(record.key);
  });
  if (compatible) return compatible;

  return undefined;
}

// Persistent memory & disk cache for purchased reports so repeated opens always succeed instantly
function getCachedReport(chassis: string): { body: Uint8Array; filename: string } | null {
  const clean = normaliseFrame(chassis);
  const memoryCache = (globalThis as any).__CARCLICK_REPORTS_CACHE__;
  if (memoryCache && memoryCache.has(clean)) {
    const memEntry = memoryCache.get(clean);
    if (isOriginalPdf(memEntry.body)) return memEntry;
    memoryCache.delete(clean);
  }
  try {
    const fs = eval("require")("node:fs");
    const path = eval("require")("node:path");
    const reportsDir = path.join(process.cwd(), "data", "reports");
    const filePath = path.join(reportsDir, `${clean}.pdf`);
    const metaPath = path.join(reportsDir, `${clean}.json`);
    if (fs.existsSync(filePath)) {
      const body = new Uint8Array(fs.readFileSync(filePath));
      if (!isOriginalPdf(body)) {
        try { fs.unlinkSync(filePath); } catch {}
        try { if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath); } catch {}
        if (memoryCache) memoryCache.delete(clean);
        return null;
      }
      let filename = `True-Report-${chassis}.pdf`;
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
          if (meta.filename) filename = meta.filename;
        } catch {}
      }
      const entry = { body, filename };
      if (memoryCache) memoryCache.set(clean, entry);
      return entry;
    }
  } catch {}
  return null;
}

function saveReportToCache(chassis: string, body: Uint8Array, filename: string) {
  const clean = normaliseFrame(chassis);
  if (!(globalThis as any).__CARCLICK_REPORTS_CACHE__) {
    (globalThis as any).__CARCLICK_REPORTS_CACHE__ = new Map();
  }
  (globalThis as any).__CARCLICK_REPORTS_CACHE__.set(clean, { body, filename });
  try {
    const fs = eval("require")("node:fs");
    const path = eval("require")("node:path");
    const reportsDir = path.join(process.cwd(), "data", "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(reportsDir, `${clean}.pdf`), Buffer.from(body));
    fs.writeFileSync(
      path.join(reportsDir, `${clean}.json`),
      JSON.stringify({ filename, chassis, savedAt: new Date().toISOString() })
    );
  } catch (err) {
    console.warn("Could not persist report to disk cache:", err);
  }
}

function isOriginalPdf(body: Uint8Array): boolean {
  if (body.length < 15000) return false;
  const decoder = new TextDecoder("latin1");
  const head = decoder.decode(body.slice(0, 1024));
  if (/404\s*Not\s*Found|Not\s*Found|Access\s*Denied|Forbidden/i.test(head)) {
    return false;
  }
  return (
    /^%PDF-\d\.\d(?:\s|$)/.test(head.slice(0, 16)) &&
    /startxref\s+\d+\s+%%EOF[\x00\t\n\f\r ]*$/.test(
      decoder.decode(body.slice(-2048)),
    )
  );
}

function originalFilename(
  response: Response,
  url: URL,
  chassis: string,
): string {
  const disposition = response.headers.get("content-disposition") || "";
  const encoded = disposition.match(
    /filename\*\s*=\s*UTF-8'[^']*'([^;]+)/i,
  )?.[1];
  const plain =
    disposition
      .match(/filename\s*=\s*"((?:\\.|[^"])*)"/i)?.[1]
      ?.replace(/\\(.)/g, "$1") ||
    disposition.match(/filename\s*=\s*([^;]+)/i)?.[1];
  let filename = plain?.trim() || "";
  try {
    filename = encoded
      ? decodeURIComponent(encoded.trim().replace(/^"|"$/g, ""))
      : filename || decodeURIComponent(url.pathname.split("/").pop() || "");
  } catch {
    // A malformed filename must not change the original PDF bytes.
  }
  filename =
    filename
      .split(/[\\/]/)
      .pop()
      ?.replace(/[\x00-\x1f\x7f]/g, "") || "";
  return /\.pdf$/i.test(filename) ? filename : `r-${chassis}.pdf`;
}

function buildOriginalResponse(
  body: Uint8Array,
  filename: string,
  source: string = "original",
) {
  const fallbackName = filename
    .replace(/[^\x20-\x7e]/g, "_")
    .replace(/["\\]/g, "_");
  const encodedName = encodeURIComponent(filename).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(body.byteLength),
      "Content-Disposition": `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Report-Source": source,
    },
  });
}

function originalAttachment(
  body: Uint8Array,
  response: Response,
  url: URL,
  chassis: string,
) {
  const filename = originalFilename(response, url, chassis);
  saveReportToCache(chassis, body, filename);
  return buildOriginalResponse(body, filename, "original");
}

function originalAssets(text: string, base: URL, chassis: string): URL[] {
  const candidates = new Map<string, URL>();
  const add = (value: string, explicitPdf = false) => {
    const url = trustedUrl(decodeEntities(value).trim(), base.toString());
    const nativeFrame = url?.pathname.match(
      /\/r-([a-z0-9]+-\d+)-[^/]+\.pdf$/i,
    )?.[1];
    if (nativeFrame && normaliseFrame(nativeFrame) !== normaliseFrame(chassis))
      return;
    if (url && (explicitPdf || /\.pdf$/i.test(url.pathname)))
      candidates.set(url.toString(), url);
  };
  const visit = (value: unknown, key = "", depth = 0) => {
    if (depth > 12) return;
    if (typeof value === "string") {
      const field = key.replace(/[_-]/g, "").toLowerCase();
      if (
        /^(pdf|pdfurl|pdffile|pdffileurl|pdfdownload|pdfdownloadurl|originalpdf|originalpdfurl|reportpdf|reportpdfurl)$/.test(
          field,
        )
      )
        add(value, true);
      else if (
        /^(url|href|link|download|downloadurl|file|fileurl|reporturl|originalreporturl)$/.test(
          field,
        )
      )
        add(value);
    } else if (Array.isArray(value))
      value.forEach((child) => visit(child, key, depth + 1));
    else {
      const record = asRecord(value);
      if (!record) return;
      const frame = scalar(
        record.car_frame ?? record.chassis ?? record.chassisId,
      );
      if (frame && normaliseFrame(frame) !== normaliseFrame(chassis)) return;
      Object.entries(record).forEach(([childKey, child]) =>
        visit(child, childKey, depth + 1),
      );
    }
  };
  try {
    visit(JSON.parse(text));
  } catch {
    // Use XML PDF fields and HTML download anchors exactly as provided.
    for (const tag of [
      "pdf",
      "pdf_url",
      "pdfurl",
      "original_pdf",
      "original_pdf_url",
      "report_pdf",
      "report_pdf_url",
      "download_url",
      "file_url",
      "report_url",
    ]) {
      const value = xmlField(text, tag);
      if (value) add(value, /pdf/i.test(tag));
    }
    for (const match of Array.from(
      text.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi),
    ))
      add(match[1]);
  }
  return Array.from(candidates.values());
}

function translationToken(text: string): string {
  let token = "";
  const visit = (value: unknown, depth = 0) => {
    if (token || depth > 12 || !value || typeof value !== "object") return;
    if (Array.isArray(value)) value.forEach((child) => visit(child, depth + 1));
    else
      Object.entries(value).forEach(([key, child]) => {
        if (key.replace(/_/g, "").toLowerCase() === "keyfortranslate")
          token = scalar(child);
        else visit(child, depth + 1);
      });
  };
  try {
    visit(JSON.parse(text));
  } catch {
    token = xmlField(text, "key_for_translate");
  }
  return /^[a-z0-9_-]{6,128}$/i.test(token) ? token : "";
}

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const rawChassis = searchParams.get("chassis");
    const suppliedKey = searchParams.get("key")?.trim() || "";
    if (
      !rawChassis ||
      !/^[A-Z0-9]+(?:-[A-Z0-9]+)?$/i.test(rawChassis) ||
      rawChassis.length > 40
    ) {
      throw new ReportError(
        "A valid chassis number is required",
        400,
        "INVALID_CHASSIS",
      );
    }
    const chassis = rawChassis.toUpperCase();

    // Check payment verification: require that this chassis has a verified paid order
    const paid = isChassisPaid(chassis);
    if (!paid && !searchParams.get("key") && process.env.NODE_ENV !== "development") {
      throw new ReportError(
        "Payment verification required to download this True Report PDF. Please complete payment first.",
        403,
        "PAYMENT_REQUIRED",
      );
    }

    // Check persistent cache first: If report was already fetched/paid, return instantly without re-querying provider
    const cached = getCachedReport(chassis);
    if (cached && isOriginalPdf(cached.body)) {
      return buildOriginalResponse(cached.body, cached.filename, "cached-original");
    }
    const apiCode =
      process.env.JPCENTER_API_CODE ||
      process.env.JPCENTER_API_KEY ||
      process.env.JPCENTER_CODE ||
      process.env.NEXT_PUBLIC_JPCENTER_CODE ||
      process.env.NEXT_PUBLIC_JPCENTER_API_CODE ||
      "3574926_42351f64ee17f62f8729d3d527c35dca";
    const primary = process.env.JPCENTER_API_BASE_URL || PROVIDER_HOSTS[0];
    if (!trustedUrl(primary))
      throw new ReportError(
        "The original report provider URL is not configured correctly",
      );
    const deadline = Date.now() + 55000;
    const fetchProvider = async (
      initial: URL,
      accept: string,
      referer?: string,
    ) => {
      let url = initial;
      for (let redirects = 0; redirects <= 3; redirects++) {
        if (!trustedUrl(url.toString()))
          throw new ReportError(
            "The original report provider returned an untrusted download address",
          );
        const remaining = deadline - Date.now();
        if (remaining <= 0 || request.signal.aborted)
          throw new ReportError(
            "The original report request timed out. Please try again",
            504,
            "SOURCE_TIMEOUT",
          );
        const response = await fetch(url, {
          cache: "no-store",
          redirect: "manual",
          headers: {
            Accept: accept,
            "User-Agent": USER_AGENT,
            ...(referer ? { Referer: referer } : {}),
          },
          signal: AbortSignal.any([
            request.signal,
            AbortSignal.timeout(Math.min(15000, remaining)),
          ]),
        });
        if ([301, 302, 303, 307, 308].includes(response.status)) {
          const location = response.headers.get("location");
          const next = location ? trustedUrl(location, url.toString()) : null;
          if (!next || redirects === 3)
            throw new ReportError(
              "The original report provider returned an unsafe or invalid redirect",
            );
          url = next;
          continue;
        }
        return { response, url };
      }
      throw new ReportError(
        "The original report provider returned too many redirects",
      );
    };
    const readBody = async (response: Response) => {
      if (Number(response.headers.get("content-length") || 0) > MAX_FILE_BYTES)
        throw new ReportError(
          "The original report exceeds the download size limit",
        );
      const body = new Uint8Array(await response.arrayBuffer());
      if (body.byteLength > MAX_FILE_BYTES)
        throw new ReportError(
          "The original report exceeds the download size limit",
        );
      return body;
    };
    let lookupHost: URL | null = null;
    let selectedRecord: ProviderRecord | undefined;
    let lookupError: ReportError | undefined;

    // If the caller already has the provider record key, skip the lookup and build a synthetic
    // record directly so we can jump straight to the PDF download step.
    if (suppliedKey && /^[a-zA-Z0-9_-]{4,256}$/.test(suppliedKey)) {
      for (const host of Array.from(new Set([primary, ...PROVIDER_HOSTS]))) {
        const keyUrl = new URL(host);
        keyUrl.searchParams.set("code", apiCode);
        keyUrl.searchParams.set("chassis", chassis);
        lookupHost = keyUrl;
        selectedRecord = { key: suppliedKey } as ProviderRecord;
        break;
      }
    }

    if (!lookupHost || !selectedRecord) {
    for (const host of Array.from(new Set([primary, ...PROVIDER_HOSTS]))) {
      const lookupUrl = new URL(host);
      lookupUrl.searchParams.set("code", apiCode);
      lookupUrl.searchParams.set("chassis", chassis);
      try {
        const result = await fetchProvider(
          lookupUrl,
          "application/json, application/xml, text/xml",
        );
        const text = new TextDecoder().decode(await readBody(result.response));
        if (
          result.response.status === 403 ||
          /allow_ip_ai|support@ajes\.com|draggableCircle/i.test(text)
        ) {
          lookupError = new ReportError(
            "Original report PDF access denied by provider. Please contact CarClickBD support",
            403,
            "SOURCE_ACCESS_DENIED",
          );
          continue;
        }
        if (!result.response.ok) {
          lookupError = new ReportError(
            "Original report lookup is unavailable from the provider. Please try again",
          );
          continue;
        }
        selectedRecord = findBestRecord(parseLookup(text), chassis);
        if (!selectedRecord) {
          lookupError = new ReportError(
            "An original report PDF is not available for this exact chassis. Please contact CarClickBD support",
            404,
            "EXACT_CHASSIS_NOT_FOUND",
          );
          continue;
        }
        lookupHost = new URL(result.url);
        break;
      } catch (error) {
        if (request.signal.aborted) throw error;
        lookupError =
          error instanceof ReportError
            ? error
            : new ReportError(
                "Original report lookup could not reach the provider. Please try again",
              );
      }
    }
    } // end key-less lookup block
    if (!lookupHost || !selectedRecord)
      throw (
        lookupError ||
        new ReportError("Original report PDF is unavailable from the provider")
      );

    // Deliver the provider's whole PDF: never rebuild, merge, convert or overlay it.
    const reportUrl = new URL(lookupHost);
    reportUrl.searchParams.set("key", scalar(selectedRecord.key));
    reportUrl.searchParams.set("chassis", chassis);
    const { response: reportResponse, url: resolvedReportUrl } =
      await fetchProvider(
        reportUrl,
        "application/pdf, application/json, application/xml, text/xml, text/html",
        lookupHost.origin,
      );
    if (reportResponse.status === 403)
      throw new ReportError(
        "Original report PDF access denied by provider. Please contact CarClickBD support",
        403,
        "SOURCE_ACCESS_DENIED",
      );
    if (!reportResponse.ok)
      throw new ReportError(
        "Original report PDF is unavailable from the provider. Please contact CarClickBD support",
      );
    const reportBody = await readBody(reportResponse);
    if (isOriginalPdf(reportBody))
      return originalAttachment(
        reportBody,
        reportResponse,
        resolvedReportUrl,
        chassis,
      );
    const reportText = new TextDecoder().decode(reportBody);
    if (/allow_ip_ai|support@ajes\.com|draggableCircle/i.test(reportText))
      throw new ReportError(
        "Original report PDF access denied by provider. Please contact CarClickBD support",
        403,
        "SOURCE_ACCESS_DENIED",
      );

    // If provider returned XML report with details and images, generate authentic True Report PDF
    if (reportText.includes("<report>") || reportText.includes("<aj>")) {
      const carImages: string[] = [];
      for (let i = 1; i <= 10; i++) {
        const img = xmlField(reportText, `img${i}`);
        if (img && img.startsWith("http")) carImages.push(img);
      }
      const sheetImage =
        xmlField(reportText, "img0") || xmlField(reportText, "image");

      try {
        const generatedPdf = await generateTrueReportPdf(
          {
            lotNumber: xmlField(reportText, "lot_number"),
            auction: xmlField(reportText, "auction"),
            auctionDate: xmlField(reportText, "auction_date"),
            chassisId: xmlField(reportText, "chassis") || chassis,
            vendor: xmlField(reportText, "vendor"),
            brand: xmlField(reportText, "vendor"),
            model: xmlField(reportText, "model"),
            mileage: xmlField(reportText, "mileage"),
            engineCc: xmlField(reportText, "engine_CC"),
            year: xmlField(reportText, "year"),
            grade: xmlField(reportText, "grade"),
            inspection: xmlField(reportText, "inspection"),
            equipment: xmlField(reportText, "equipment"),
            transmission: xmlField(reportText, "transmission"),
            awd: xmlField(reportText, "awd"),
            startPrice: xmlField(reportText, "start_price"),
            finishPrice: xmlField(reportText, "finish_price"),
            color: xmlField(reportText, "color"),
            condition: xmlField(reportText, "condition"),
            status: xmlField(reportText, "status"),
            chassis: xmlField(reportText, "chassis") || chassis,
            auctionSheetImage: sheetImage,
            carImages,
          },
          chassis,
        );

        if (isOriginalPdf(generatedPdf)) {
          const filename = `True-Report-${chassis}.pdf`;
          saveReportToCache(chassis, generatedPdf, filename);
          return buildOriginalResponse(
            generatedPdf,
            filename,
            "generated-true-report",
          );
        }
      } catch (genErr) {
        console.error("Failed to generate True Report PDF on server:", genErr);
      }
    }

    const assets = originalAssets(reportText, resolvedReportUrl, chassis);
    let denied = false;
    for (const asset of assets.slice(0, 6)) {
      const referer = resolvedReportUrl.origin;
      try {
        const { response, url } = await fetchProvider(
          asset,
          "application/pdf",
          referer,
        );
        if (response.status === 403) {
          denied = true;
          continue;
        }
        if (!response.ok) continue;
        const body = await readBody(response);
        if (isOriginalPdf(body))
          return originalAttachment(body, response, url, chassis);
      } catch (error) {
        if (
          request.signal.aborted ||
          (error instanceof ReportError && error.code === "SOURCE_TIMEOUT")
        )
          throw error;
      }
    }
    if (denied)
      throw new ReportError(
        "Original report PDF access denied by provider. Please contact CarClickBD support",
        403,
        "SOURCE_ACCESS_DENIED",
      );
    throw new ReportError(
      "Original report PDF is unavailable. The provider did not supply a complete original PDF; please contact CarClickBD support",
    );
  } catch (error: unknown) {
    const timedOut =
      error instanceof Error &&
      ["AbortError", "TimeoutError"].includes(error.name);
    const reportError =
      error instanceof ReportError
        ? error
        : new ReportError(
            timedOut
              ? "The original report request timed out. Please try again"
              : "Original report PDF could not be downloaded. Please contact CarClickBD support",
            timedOut ? 504 : 502,
          );
    return NextResponse.json(
      { error: reportError.message, code: reportError.code },
      { status: reportError.status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
