#!/usr/bin/env node
/*
 * Run: node scripts/check-original-report.cjs [--reference /absolute/source.pdf] [--output /absolute/delivered.pdf]
 * Every upstream request is mocked. This never calls or charges the provider API.
 * An optional reference is read without editing it; its complete byte sequence is
 * checked through both supported delivery paths, preserving every page and QR.
 */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const routePath = path.join(root, "src/app/api/jpcenter/download/route.ts");
const chassis = "NKE165-7265802";
const sourceUrl = "https://8.ajes.com/reports/provider-original-report.pdf";
const primaryHost = "https://au.avto.jp/api/report";
const fallbackHost = "https://ajes.com/api/report";

function makeFixturePdf() {
  // A valid, small six-page PDF. The first page includes vector QR-like marks;
  // equality checks cover these source objects as well as every remaining page.
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R 5 0 R 7 0 R 9 0 R 11 0 R 13 0 R] /Count 6 >>",
  ];
  for (let page = 0; page < 6; page++) {
    const contentObject = objects.length + 2;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents ${contentObject} 0 R >>`,
    );
    const stream = [
      `% Source page ${page + 1}; preserve without conversion`,
      "0 0 0 rg",
      ...(page === 0
        ? [
            "% Original QR graphics sentinel",
            "20 20 28 28 re f",
            "55 20 28 28 re f",
            "20 55 28 28 re f",
            "55 55 7 7 re f",
            "69 69 7 7 re f",
          ]
        : [`20 ${20 + page * 10} 100 5 re f`]),
      "",
    ].join("\n");
    objects.push(
      `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`,
    );
  }
  let pdf = "%PDF-1.4\n% Original document fixture\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf);
}

const args = process.argv.slice(2);
const options = {};
for (let index = 0; index < args.length; index += 2) {
  const name = args[index];
  const value = args[index + 1];
  if (!["--reference", "--output"].includes(name) || !value || options[name]) {
    console.error(
      "Usage: node scripts/check-original-report.cjs [--reference /absolute/source.pdf] [--output /absolute/delivered.pdf]",
    );
    process.exit(1);
  }
  options[name] = path.resolve(value);
}
if (
  options["--output"] &&
  options["--reference"] &&
  options["--output"].toLowerCase() === options["--reference"].toLowerCase()
) {
  console.error(
    "The output must be a separate file so the source reference stays untouched.",
  );
  process.exit(1);
}
const original = options["--reference"]
  ? fs.readFileSync(options["--reference"])
  : makeFixturePdf();
const sourceFilename = options["--reference"]
  ? path.basename(options["--reference"])
  : "provider-original-report.pdf";
assert.ok(
  original.subarray(0, 5).equals(Buffer.from("%PDF-")),
  "Reference must be a PDF",
);
assert.ok(
  original.includes(Buffer.from("%%EOF")),
  "Reference must contain its PDF trailer",
);
const originalHash = crypto.createHash("sha256").update(original).digest("hex");
const pageCount = (
  original.toString("latin1").match(/\/Type\s*\/Page\b/g) || []
).length;
assert.equal(
  pageCount,
  6,
  "The report reference must contain all six source pages",
);

class MockNextResponse extends Response {
  static json(data, init = {}) {
    const headers = new Headers(init.headers);
    headers.set("content-type", "application/json");
    return new MockNextResponse(JSON.stringify(data), { ...init, headers });
  }
}

const routeSource = ts.transpileModule(fs.readFileSync(routePath, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    esModuleInterop: true,
  },
  fileName: routePath,
}).outputText;

function loadRoute(mockFetch, extraEnvironment = {}) {
  const routeModule = { exports: {} };
  const context = vm.createContext({
    module: routeModule,
    exports: routeModule.exports,
    require(name) {
      assert.equal(
        name,
        "next/server",
        "Unexpected route import needs an explicit test mock",
      );
      return { NextResponse: MockNextResponse };
    },
    URL,
    Request,
    Response,
    Headers,
    AbortSignal,
    TextDecoder,
    TextEncoder,
    Uint8Array,
    Buffer,
    fetch: mockFetch,
    console: { error() {}, warn() {}, log() {} },
    process: {
      env: {
        JPCENTER_API_CODE: "test-only-code-no-live-provider",
        JPCENTER_API_BASE_URL: primaryHost,
        ...extraEnvironment,
      },
    },
  });
  vm.runInContext(routeSource, context, { filename: routePath });
  assert.equal(typeof routeModule.exports.GET, "function");
  return routeModule.exports.GET;
}

const records = [
  { key: "similar-key", color: "1", car_frame: "NKE165-7265801" },
  { key: "exact-key", color: "3", car_frame: chassis },
];
const jsonResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
const pdfResponse = (headers = {}) =>
  new Response(original, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${sourceFilename}"`,
      ...headers,
    },
  });

function providerMock(report, options = {}) {
  const calls = [];
  const lookupRecords = options.records || records;
  let upstreamAssertion;
  const responder = async (input, init) => {
    const url = new URL(String(input));
    calls.push({ url, init });
    if (url.pathname === "/api/report" && !url.searchParams.has("key")) {
      assert.equal(url.searchParams.get("chassis"), chassis);
      assert.equal(
        url.searchParams.get("code"),
        "test-only-code-no-live-provider",
      );
      if (options.failPrimary && url.origin === new URL(primaryHost).origin) {
        return jsonResponse({ error: "temporary provider outage" }, 503);
      }
      return jsonResponse({ aj: lookupRecords });
    }
    if (url.pathname === "/api/report" && url.searchParams.has("key")) {
      assert.equal(
        url.searchParams.get("key"),
        "exact-key",
        "A similar chassis was selected",
      );
      if (options.failPrimary) {
        assert.equal(
          url.origin,
          new URL(fallbackHost).origin,
          "Report must use the successful lookup host",
        );
      }
      return report(url, init);
    }
    if (options.asset) return options.asset(url, init);
    assert.fail(`Unexpected upstream request: ${url.origin}${url.pathname}`);
  };
  const routeGet = loadRoute(async (input, init) => {
    try {
      return await responder(input, init);
    } catch (error) {
      upstreamAssertion = error;
      throw error;
    }
  });
  return {
    calls,
    async get(input) {
      const response = await routeGet(input);
      // A route's generic error handler must not hide failed fetch assertions.
      if (upstreamAssertion) throw upstreamAssertion;
      return response;
    },
  };
}

function request(query = `chassis=${chassis}`) {
  return new Request(`https://carclickbd.test/api/jpcenter/download?${query}`);
}

async function assertOriginal(response, filename = sourceFilename) {
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.match(
    response.headers.get("content-disposition") || "",
    /attachment;/i,
  );
  assert.ok(
    (response.headers.get("content-disposition") || "").includes(filename),
    "The provider's original filename must be preserved",
  );
  assert.match(response.headers.get("cache-control") || "", /no-store/i);
  assert.equal(response.headers.get("content-length"), String(original.length));
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-report-source"), "original");
  const downloaded = Buffer.from(await response.arrayBuffer());
  assert.ok(
    downloaded.equals(original),
    "Original PDF bytes changed during delivery",
  );
  assert.equal(
    crypto.createHash("sha256").update(downloaded).digest("hex"),
    originalHash,
  );
  assert.equal(
    (downloaded.toString("latin1").match(/\/Type\s*\/Page\b/g) || []).length,
    6,
    "A source page disappeared",
  );
}

async function assertRejected(response) {
  assert.ok(
    response.status >= 400,
    `Expected refusal, received ${response.status}`,
  );
  assert.doesNotMatch(
    response.headers.get("content-type") || "",
    /application\/pdf/i,
  );
  assert.equal(response.headers.get("content-disposition"), null);
  const body = await response.json();
  assert.ok(
    typeof body.error === "string" && body.error.length,
    "Refusal must have a useful error",
  );
  return body;
}

const tests = [];
const test = (name, run) => tests.push({ name, run });
let deliveredOriginal;

test("Direct provider PDF remains byte-for-byte original with its filename", async () => {
  const { get } = providerMock(() => pdfResponse());
  const response = await get(request());
  deliveredOriginal = Buffer.from(await response.clone().arrayBuffer());
  await assertOriginal(response);
});

test("PDF bytes are detected when the provider uses application/octet-stream", async () => {
  const { get } = providerMock(() =>
    pdfResponse({ "content-type": "application/octet-stream" }),
  );
  await assertOriginal(await get(request()));
});

test("Full report JSON resolves the original PDF and preserves all source pages", async () => {
  const { get } = providerMock(
    () =>
      jsonResponse({
        report: { pdf_url: sourceUrl, img0: "https://8.ajes.com/sheet.jpg" },
      }),
    {
      asset(url) {
        assert.equal(
          url.toString(),
          sourceUrl,
          "Only the original PDF should be downloaded",
        );
        return pdfResponse();
      },
    },
  );
  await assertOriginal(await get(request()));
});

test("Full report XML resolves the provider's original PDF URL", async () => {
  const { get } = providerMock(
    () =>
      new Response(
        `<reports><report><pdf_url><![CDATA[${sourceUrl}]]></pdf_url></report></reports>`,
        { headers: { "content-type": "application/xml" } },
      ),
    {
      asset(url) {
        assert.equal(url.toString(), sourceUrl);
        return pdfResponse();
      },
    },
  );
  await assertOriginal(await get(request()));
});

test("The source URL filename is retained when no attachment name is supplied", async () => {
  const { get } = providerMock(() => jsonResponse({ pdf_url: sourceUrl }), {
    asset: () =>
      new Response(original, {
        headers: { "content-type": "application/pdf" },
      }),
  });
  await assertOriginal(await get(request()), "provider-original-report.pdf");
});

test("Redirects between trusted provider URLs preserve the original PDF", async () => {
  const finalUrl = "https://8.ajes.com/reports/redirected-original.pdf";
  const { get } = providerMock(() => jsonResponse({ pdf_url: sourceUrl }), {
    asset(url, init) {
      assert.equal(
        init.redirect,
        "manual",
        "Redirect targets require validation",
      );
      if (url.toString() === sourceUrl) {
        return new Response(null, {
          status: 302,
          headers: { location: finalUrl },
        });
      }
      assert.equal(url.toString(), finalUrl);
      return pdfResponse();
    },
  });
  await assertOriginal(await get(request()));
});

test("A trusted asset cannot redirect a download to an untrusted host", async () => {
  const { get } = providerMock(() => jsonResponse({ pdf_url: sourceUrl }), {
    asset(url, init) {
      assert.equal(
        url.toString(),
        sourceUrl,
        "An untrusted redirect was fetched",
      );
      assert.equal(
        init.redirect,
        "manual",
        "Redirect targets require validation",
      );
      return new Response(null, {
        status: 302,
        headers: { location: "https://127.0.0.1/private/original.pdf" },
      });
    },
  });
  await assertRejected(await get(request()));
});

test("A successful fallback lookup is used for the paid report request", async () => {
  const { get } = providerMock(() => pdfResponse(), { failPrimary: true });
  await assertOriginal(await get(request()));
});

test("A returned provider translation token resolves its native original PDF", async () => {
  const token = "wNuK3FXFguqRH";
  const nativeUrl = `https://pdf.ajes.com/r-${chassis}-${token}.pdf?ok`;
  for (const report of [
    () => jsonResponse({ key_for_translate: token, reports: [{ chassis }] }),
    () =>
      new Response(
        `<aj><key_for_translate>${token}</key_for_translate><report><chassis>${chassis}</chassis></report></aj>`,
        { headers: { "content-type": "application/xml" } },
      ),
  ]) {
    const { get } = providerMock(report, {
      asset(url, init) {
        assert.equal(url.toString(), nativeUrl);
        assert.equal(
          init.headers.Referer,
          `https://ajes.com/r-${chassis}-${token}?to_print=1`,
        );
        return pdfResponse();
      },
    });
    await assertOriginal(await get(request()));
  }
});

test("Malformed translation tokens cannot trigger guessed report downloads", async () => {
  for (const token of ["", "abc", "../private/original", "token?override=1"]) {
    const { get } = providerMock(() =>
      jsonResponse({ key_for_translate: token }),
    );
    await assertRejected(await get(request()));
  }
});

test("Provider access denial remains an explicit 403 and never returns a PDF", async () => {
  const scenarios = [
    providerMock(() => new Response("Access denied", { status: 403 })).get,
    providerMock(() => jsonResponse({ pdf_url: sourceUrl }), {
      asset: () => new Response("Access denied", { status: 403 }),
    }).get,
    loadRoute(async () => new Response("Access denied", { status: 403 })),
  ];
  for (const get of scenarios) {
    const response = await get(request());
    assert.equal(response.status, 403);
    const body = await assertRejected(response);
    assert.equal(body.code, "SOURCE_ACCESS_DENIED");
  }
});

test("PDF metadata for a different chassis is never downloaded", async () => {
  const { get } = providerMock(() =>
    jsonResponse({ report: { chassis: "NKE165-7265801", pdf_url: sourceUrl } }),
  );
  await assertRejected(await get(request()));
});

test("XML PDF URLs for a different chassis are never downloaded", async () => {
  const { get } = providerMock(
    () =>
      new Response(
        `<reports><report><chassis>NKE165-7265801</chassis><pdf_url>${sourceUrl}</pdf_url></report></reports>`,
        { headers: { "content-type": "application/xml" } },
      ),
  );
  await assertRejected(await get(request()));
});

test("An identifiable native PDF filename for another chassis is refused", async () => {
  const { get } = providerMock(() =>
    jsonResponse({
      pdf_url: "https://pdf.ajes.com/r-NKE165-7265801-wNuK3FXFguqRH.pdf?ok",
    }),
  );
  await assertRejected(await get(request()));
});

test("Translation tokens belonging to another chassis never trigger a download", async () => {
  const token = "wNuK3FXFguqRH";
  for (const report of [
    () =>
      jsonResponse({
        report: { chassis: "NKE165-7265801", key_for_translate: token },
      }),
    () =>
      jsonResponse({
        key_for_translate: token,
        reports: [{ chassis: "NKE165-7265801" }],
      }),
    () =>
      new Response(
        `<reports><report><chassis>NKE165-7265801</chassis><key_for_translate>${token}</key_for_translate></report></reports>`,
        { headers: { "content-type": "application/xml" } },
      ),
  ]) {
    const { get } = providerMock(report);
    await assertRejected(await get(request()));
  }
});

test("A similar chassis alone never triggers a paid report request", async () => {
  const { get, calls } = providerMock(
    () => assert.fail("A similar record must not be purchased"),
    {
      records: [records[0]],
    },
  );
  await assertRejected(await get(request()));
  assert.ok(calls.every(({ url }) => !url.searchParams.has("key")));
});

test("Direct JPEG cannot be passed off as an original bank PDF", async () => {
  const { get } = providerMock(
    () =>
      new Response(Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        headers: { "content-type": "image/jpeg" },
      }),
  );
  await assertRejected(await get(request()));
});

test("Image-only report metadata cannot generate or deliver a replacement PDF", async () => {
  const { get } = providerMock(
    () =>
      jsonResponse({
        report: {
          img0: "https://8.ajes.com/sheet.jpg",
          img1: "https://8.ajes.com/car.jpg",
        },
      }),
    {
      asset: () =>
        new Response(Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
          headers: { "content-type": "image/jpeg" },
        }),
    },
  );
  await assertRejected(await get(request()));
});

test("HTML mislabeled as application/pdf is refused", async () => {
  const { get } = providerMock(
    () =>
      new Response("<html>Provider challenge</html>", {
        headers: { "content-type": "application/pdf" },
      }),
  );
  await assertRejected(await get(request()));
});

test("A truncated PDF signature is refused", async () => {
  const { get } = providerMock(
    () =>
      new Response("%PDF-", {
        headers: { "content-type": "application/pdf" },
      }),
  );
  await assertRejected(await get(request()));
});

test("An invalid PDF from a trusted metadata URL is refused", async () => {
  const { get } = providerMock(() => jsonResponse({ pdf_url: sourceUrl }), {
    asset: () =>
      new Response("This is not a PDF", {
        headers: { "content-type": "application/pdf" },
      }),
  });
  await assertRejected(await get(request()));
});

test("Missing or malformed chassis is refused before an upstream request", async () => {
  for (const query of [
    "",
    "chassis=",
    "chassis=%3Cscript%3E",
    "chassis=NKE165%0D%0A7265802",
    "chassis=NKE165%2F7265802",
  ]) {
    const get = loadRoute(() =>
      assert.fail("Malformed input must not reach the provider"),
    );
    const response = await get(request(query));
    assert.equal(response.status, 400);
    await assertRejected(response);
  }
});

test("Untrusted, spoofed, credentialed and non-HTTP PDF URLs are never fetched", async () => {
  for (const url of [
    "https://127.0.0.1/internal/original.pdf",
    "https://ajes.com.evil.test/original.pdf",
    "https://user:password@8.ajes.com/original.pdf",
    "file:///private/original.pdf",
  ]) {
    const { get } = providerMock(() => jsonResponse({ pdf_url: url }));
    await assertRejected(await get(request()));
  }
});

async function main() {
  let failed = 0;
  for (const { name, run } of tests) {
    try {
      await run();
      console.log(`PASS ${name}`);
    } catch (error) {
      failed++;
      console.error(`FAIL ${name}\n  ${error.message}`);
    }
  }
  console.log(
    `\n${tests.length - failed}/${tests.length} checks passed; source has ${pageCount} pages, SHA-256 ${originalHash}`,
  );
  if (!failed && options["--reference"]) {
    console.log(
      "Reference PDF preserved exactly: every source page, photo and original QR object is unchanged.",
    );
  }
  if (!failed && options["--output"]) {
    assert.ok(deliveredOriginal && deliveredOriginal.equals(original));
    fs.mkdirSync(path.dirname(options["--output"]), { recursive: true });
    fs.writeFileSync(options["--output"], deliveredOriginal);
    console.log(`Verified provider delivery saved to ${options["--output"]}`);
  }
  process.exitCode = failed ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
