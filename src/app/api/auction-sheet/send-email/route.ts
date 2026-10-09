import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ReportValue = string | number | boolean | null | undefined;

const getNestedValue = (source: any, keys: string[]): ReportValue => {
  if (!source || typeof source !== 'object') return undefined;
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
  }
  for (const value of Object.values(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nestedValue = getNestedValue(value, keys);
      if (nestedValue !== undefined && nestedValue !== null && nestedValue !== '') {
        return nestedValue;
      }
    }
  }
  return undefined;
};

const getNestedImage = (source: any): string => {
  const image = getNestedValue(source, ['image', 'image_url', 'imageUrl', 'photo', 'photo_url', 'sheet_image', 'sheetImage', 'auction_sheet', 'auctionSheet']);
  return typeof image === 'string' && /^https?:\/\//i.test(image) ? image : '';
};

export async function POST(request: Request) {
  try {
    const { email, name, chassis, amount, mobileNumber, downloadUrl } = await request.json();

    if (!email || !chassis) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const smtpEmail = process.env.SMTP_EMAIL || process.env.EMAIL || process.env.NEXT_PUBLIC_SMTP_EMAIL || process.env.NEXT_PUBLIC_EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.NEXT_PUBLIC_SMTP_PASSWORD || process.env.NEXT_PUBLIC_EMAIL_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      console.error('SMTP credentials not configured in environment variables.');
      return NextResponse.json({ success: false, error: 'Email configuration missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const attachments: any[] = [];
    let vehicleModel = 'N/A';
    let vehicleYear = 'N/A';
    let vehicleColor = 'N/A';
    let vehicleGrade = 'N/A';
    let imageUrl = '';
    let pdfUrl: string | null = downloadUrl && downloadUrl.includes('.pdf') ? downloadUrl : null;

    try {
      const apiCode = process.env.JPCENTER_API_CODE || process.env.JPCENTER_API_KEY || process.env.JPCENTER_CODE || '3574926_42351f64ee17f62f8729d3d527c35dca';
      if (apiCode && !pdfUrl) {
        // Only call JPCenter if we don't already have a PDF url
        const lookupUrl = `https://jpcenter.ru/api/report?json=&code=${apiCode}&chassis=${chassis}`;
        const lookupRes = await fetch(lookupUrl, { signal: AbortSignal.timeout(15000) });
        const lookupJson = await lookupRes.json();
        const records = Array.isArray(lookupJson?.aj) ? lookupJson.aj.filter((r: any) => r && typeof r === 'object') : [];
        const record = records.find((item: any) => String(item.key || '').trim());

        if (record?.key) {
          const reportUrl = `https://jpcenter.ru/api/report?json=&code=${apiCode}&chassis=${chassis}&key=${record.key}`;
          const reportRes = await fetch(reportUrl, { signal: AbortSignal.timeout(15000) });
          const reportText = await reportRes.text();

          try {
            const reportJson = JSON.parse(reportText);
            const source = Array.isArray(reportJson) ? reportJson[0] : reportJson;
            const possiblePdf = Object.values(source).find((val: any) => typeof val === 'string' && val.includes('.pdf'));
            if (possiblePdf) pdfUrl = String(possiblePdf);

            vehicleModel = String(getNestedValue(source, ['model', 'car_model', 'carModel', 'name']) || 'N/A');
            vehicleYear = String(getNestedValue(source, ['year', 'car_year', 'production_year', 'productionYear', 'model_year']) || 'N/A');
            vehicleColor = String(getNestedValue(source, ['car_color', 'color', 'colour']) || 'N/A');
            vehicleGrade = String(getNestedValue(source, ['grade', 'auction_grade', 'auctionGrade', 'car_grade']) || 'N/A');
            imageUrl = getNestedImage(source);
          } catch (e) {
            const match = reportText.match(/href="([^"]+\.pdf)"/i);
            if (match && match[1]) pdfUrl = String(match[1]);
          }
        }
      }

      // Attach the PDF file
      if (pdfUrl) {
        const pdfRes = await fetch(pdfUrl, { signal: AbortSignal.timeout(20000) });
        const arrayBuffer = await pdfRes.arrayBuffer();
        attachments.push({
          filename: `auction-sheet-${chassis}.pdf`,
          content: Buffer.from(arrayBuffer),
          contentType: 'application/pdf'
        });
      }
    } catch (err) {
      console.error('Failed to fetch/attach auction sheet info:', err);
    }

    const fallbackDownloadUrl = pdfUrl || downloadUrl || `https://carclickbd.com/auction-sheets?status=success&chassis=${chassis}`;

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="background-color: #003399; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">CarClickBD</h1>
          <p style="color: #f5bd05; margin: 5px 0 0 0; font-weight: bold;">Verified Auction Sheet Report</p>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px;">Dear <strong>${name || 'Customer'}</strong>,</p>
          <p>Thank you for choosing CarClickBD. Your payment of <strong>${amount || 10} BDT</strong> for the Japanese auction sheet verification has been successfully processed.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #f5bd05; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #003399;">Vehicle Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 5px 0; font-weight: bold; width: 120px;">Chassis No:</td><td>${chassis}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Model:</td><td style="text-transform: uppercase;">${vehicleModel}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Year:</td><td style="text-transform: uppercase;">${vehicleYear}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Color:</td><td style="text-transform: uppercase;">${vehicleColor}</td></tr>
              <tr><td style="padding: 5px 0; font-weight: bold;">Grade:</td><td style="text-transform: uppercase;">${vehicleGrade}</td></tr>
            </table>
          </div>

          ${imageUrl ? `
            <div style="text-align: center; margin: 25px 0;">
              <h3 style="color: #333; margin-bottom: 10px;">Auction Sheet Image</h3>
              <img src="${imageUrl}" alt="Auction Sheet for ${chassis}" style="max-width: 100%; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 30px;">
            <p>You can also download your auction sheet in PDF format below:</p>
            <a href="${fallbackDownloadUrl}" style="background-color: #f5bd05; color: #000; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;">Download PDF Report</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 13px; color: #666; text-align: center;">
            If you need further assistance with translation or understanding the condition notes, please contact our support via WhatsApp.<br><br>
            <strong>CarClickBD Team</strong>
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: smtpEmail,
      to: email,
      subject: 'CarClickBD Auction Sheet Delivery - ' + chassis,
      html: customerHtml,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    const adminHtml = `
      <h2>New Auction Sheet Order Paid</h2>
      <p><strong>Customer:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobileNumber || 'N/A'}</p>
      <p><strong>Chassis:</strong> ${chassis}</p>
      <p><strong>Amount:</strong> ${amount || 10} BDT</p>
    `;

    await transporter.sendMail({
      from: smtpEmail,
      to: smtpEmail,
      subject: 'New Auction Sheet Payment - ' + chassis,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

