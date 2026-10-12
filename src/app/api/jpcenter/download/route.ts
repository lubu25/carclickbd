import { NextResponse } from "next/server";

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
        color: xmlField(row, "color"),
        car_frame: xmlField(row, "car_frame"),
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
  if (frame && normaliseFrame(frame) !== normaliseFrame(chassis)) return false;
  const matchFlag = scalar(record.colorTag ?? record.color);
  return (
    (matchFlag === "3" ||
      record.isExactMatch === true ||
      (!matchFlag && !!frame)) &&
    !!scalar(record.key)
  );
}

function isOriginalPdf(body: Uint8Array): boolean {
  if (body.length < 64) return false;
  const decoder = new TextDecoder("latin1");
  return (
    /^%PDF-\d\.\d(?:\s|$)/.test(decoder.decode(body.slice(0, 16))) &&
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

function originalAttachment(
  body: Uint8Array,
  response: Response,
  url: URL,
  chassis: string,
) {
  const filename = originalFilename(response, url, chassis);
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
      "X-Report-Source": "original",
    },
  });
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
    const rawChassis = new URL(request.url).searchParams.get("chassis");
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
    for (const host of Array.from(new Set([primary, ...PROVIDER_HOSTS]))) {
      const lookupUrl = new URL(host);
      lookupUrl.searchParams.set("json", "");
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
        selectedRecord = parseLookup(text).find((record) =>
          exactRecord(record, chassis),
        );
        if (!selectedRecord)
          throw new ReportError(
            "An original report PDF is not available for this exact chassis. Please contact CarClickBD support",
            404,
            "EXACT_CHASSIS_NOT_FOUND",
          );
        lookupHost = new URL(result.url);
        break;
      } catch (error) {
        if (error instanceof ReportError && error.status === 404) throw error;
        if (request.signal.aborted) throw error;
        lookupError =
          error instanceof ReportError
            ? error
            : new ReportError(
                "Original report lookup could not reach the provider. Please try again",
              );
      }
    }
    if (!lookupHost || !selectedRecord)
      throw (
        lookupError ||
        new ReportError("Original report PDF is unavailable from the provider")
      );

    // Deliver the provider's whole PDF: never rebuild, merge, convert or overlay it.
    const reportUrl = new URL(lookupHost);
    reportUrl.searchParams.set("key", scalar(selectedRecord.key));
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
    if (metadataHasWrongChassis(reportText, chassis))
      throw new ReportError(
        "The provider returned report details for a different chassis. Please contact CarClickBD support",
        502,
        "SOURCE_CHASSIS_MISMATCH",
      );
    const assets = originalAssets(reportText, resolvedReportUrl, chassis);
    const token = translationToken(reportText);
    if (token) {
      // Native URL format verified from the original PDF's own download annotation;
      // the actual token must be returned by the provider, never invented.
      const originalUrl = new URL(
        `https://pdf.ajes.com/r-${chassis}-${token}.pdf?ok`,
      );
      if (!assets.some((asset) => asset.toString() === originalUrl.toString()))
        assets.push(originalUrl);
    }
    let denied = false;
    for (const asset of assets.slice(0, 6)) {
      const referer = /\/r-[^/]+\.pdf$/i.test(asset.pathname)
        ? `https://ajes.com${asset.pathname.replace(/\.pdf$/i, "")}?to_print=1`
        : resolvedReportUrl.origin;
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
