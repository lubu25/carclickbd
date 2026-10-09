import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chassis = searchParams.get('chassis');

    if (!chassis) {
      return NextResponse.json({ error: 'Chassis parameter is required' }, { status: 400 });
    }

    const apiCode = process.env.JPCENTER_API_CODE || process.env.JPCENTER_API_KEY || process.env.JPCENTER_CODE;
    if (!apiCode) {
      return NextResponse.json({ error: 'JPCenter API code is not configured in frontend .env' }, { status: 500 });
    }

    const baseUrl = process.env.JPCENTER_API_BASE_URL || 'https://jpcenter.ru/api/report';
    const lookupUrl = new URL(baseUrl);
    lookupUrl.searchParams.set('json', '');
    lookupUrl.searchParams.set('code', apiCode);
    lookupUrl.searchParams.set('chassis', chassis.replace(/[^A-Z0-9-]/gi, ''));

    // Step 1: Lookup the record key
    const lookupResponse = await fetch(lookupUrl.toString(), { signal: AbortSignal.timeout(30000) });
    let lookupJson;
    try {
      lookupJson = await lookupResponse.json();
    } catch {
      return NextResponse.json({ error: 'Failed to parse JPCenter lookup response' }, { status: 502 });
    }

    if (!lookupResponse.ok || lookupJson?.error) {
      return NextResponse.json({ error: lookupJson?.error || 'JPCenter lookup failed' }, { status: 502 });
    }

    const records = Array.isArray(lookupJson?.aj) ? lookupJson.aj.filter((r: any) => r && typeof r === 'object') : [];
    const record = records.find((item: any) => String(item.key || '').trim());

    if (!record || !record.key) {
      return NextResponse.json({ error: 'Auction sheet is not available from JPCenter for this chassis' }, { status: 404 });
    }

    // Step 2: Request the actual PDF/report using the key (This charges the JPCenter balance)
    const reportUrl = new URL(baseUrl);
    reportUrl.searchParams.set('json', '');
    reportUrl.searchParams.set('code', apiCode);
    reportUrl.searchParams.set('chassis', chassis.replace(/[^A-Z0-9-]/gi, ''));
    reportUrl.searchParams.set('key', record.key);

    const reportResponse = await fetch(reportUrl.toString(), { signal: AbortSignal.timeout(45000) });
    const reportText = await reportResponse.text();
    let reportJson;
    try {
      reportJson = JSON.parse(reportText);
    } catch {
      reportJson = null;
    }

    if (!reportResponse.ok) {
      return NextResponse.json({ error: 'JPCenter report request failed' }, { status: 502 });
    }

    // Attempt to extract PDF URL
    let pdfUrl = null;
    let source = null;
    if (reportJson) {
       source = Array.isArray(reportJson) ? reportJson[0] : reportJson;
       // Look for string containing pdf
       const possiblePdf = Object.values(source).find((val: any) => typeof val === 'string' && val.includes('.pdf'));
       if (possiblePdf) pdfUrl = possiblePdf;
    }

    // If PDF url not in json, check if the response was HTML that contains a PDF link (common JPCenter behavior)
    if (!pdfUrl && !reportJson && typeof reportText === 'string') {
       const match = reportText.match(/href="([^"]+\.pdf)"/i);
       if (match && match[1]) {
         pdfUrl = match[1];
       }
    }

    // Fallback: If no PDF, get the high-res image URLs
    let images: string[] = [];
    if (!pdfUrl && source && Array.isArray(source.images)) {
       images = source.images.map((img: any) => img.url || img);
    }
    
    // Additional JPCenter fallback format for images array
    if (!pdfUrl && images.length === 0 && source && Array.isArray(source.aj)) {
       images = source.aj.filter((r: any) => r && r.image).map((r: any) => r.image);
    }

    if (!pdfUrl && images.length === 0) {
      return NextResponse.json({ error: 'JPCenter returned the report but no downloadable sheet was found' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      pdfUrl,
      images,
      chassis
    });
  } catch (error: any) {
    console.error('Frontend JPCenter Download Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
