import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { GET as getOriginalDownloadResponse } from '../../jpcenter/download/route';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      email,
      name,
      chassis,
      amount,
      mobileNumber,
      downloadUrl,
      pdfBase64,
      pdfFilename,
    } = await request.json();

    if (!email || !chassis) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const smtpEmail =
      process.env.SMTP_EMAIL ||
      process.env.EMAIL ||
      process.env.NEXT_PUBLIC_SMTP_EMAIL ||
      process.env.NEXT_PUBLIC_EMAIL;
    const smtpPassword =
      process.env.SMTP_PASSWORD ||
      process.env.EMAIL_PASSWORD ||
      process.env.NEXT_PUBLIC_SMTP_PASSWORD ||
      process.env.NEXT_PUBLIC_EMAIL_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      console.error('SMTP credentials not configured in environment variables.');
      return NextResponse.json(
        { success: false, error: 'Email configuration missing' },
        { status: 500 },
      );
    }

    const smtpHost =
      process.env.SMTP_HOST ||
      (smtpEmail.includes('gmail.com') ? 'smtp.gmail.com' : 'smtp.hostinger.com');
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const isSecure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: isSecure, // true for 465 (SSL)
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const cleanChassis = String(chassis).trim().toUpperCase();

    // Format payment amount accurately:
    // If user got it 100% free with coupon -> 0 BDT (Free with Coupon)
    // If user paid partial or full -> exact amount in BDT (defaults to 750 BDT if missing)
    const numAmount =
      typeof amount === 'number'
        ? amount
        : amount !== undefined && amount !== null && amount !== ''
          ? Number(amount)
          : null;

    const isFree = numAmount === 0;
    const amountPaidText = isFree
      ? 'Free (0 BDT / ০ টাকা)'
      : numAmount !== null && !isNaN(numAmount)
        ? `${numAmount} BDT`
        : '750 BDT';

    const fallbackDownloadUrl =
      downloadUrl ||
      `https://carclickbd.com/auction-sheets?status=success&chassis=${encodeURIComponent(cleanChassis)}`;

    // Retrieve the authentic, untouched original report PDF for attachment
    let pdfAttachment: {
      filename: string;
      content: Buffer;
      contentType: string;
    } | null = null;

    // 1. Direct base64 payload if provided
    if (pdfBase64 && typeof pdfBase64 === 'string') {
      try {
        const buffer = Buffer.from(pdfBase64, 'base64');
        if (
          buffer.length > 64 &&
          buffer.subarray(0, 5).toString('latin1') === '%PDF-'
        ) {
          pdfAttachment = {
            filename: pdfFilename || `r-${cleanChassis}.pdf`,
            content: buffer,
            contentType: 'application/pdf',
          };
        }
      } catch (err) {
        console.warn('Failed to parse client-provided pdfBase64:', err);
      }
    }

    // 2. Fetch authentic provider original PDF directly via our download route
    if (!pdfAttachment && cleanChassis) {
      try {
        const downloadRequest = new Request(
          `https://carclickbd.com/api/jpcenter/download?chassis=${encodeURIComponent(cleanChassis)}`,
        );
        const pdfResponse = await getOriginalDownloadResponse(downloadRequest);

        if (pdfResponse && pdfResponse.status === 200) {
          const arrayBuffer = await pdfResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          if (
            buffer.length > 64 &&
            buffer.subarray(0, 5).toString('latin1') === '%PDF-'
          ) {
            const disposition =
              pdfResponse.headers.get('content-disposition') || '';
            const encodedMatch = disposition.match(
              /filename\*=UTF-8''([^;]+)/i,
            );
            const plainMatch = disposition.match(/filename="([^"]+)"/i);
            let filename = `r-${cleanChassis}.pdf`;
            if (encodedMatch?.[1]) {
              try {
                filename = decodeURIComponent(encodedMatch[1].trim());
              } catch {}
            } else if (plainMatch?.[1]) {
              filename = plainMatch[1].trim();
            }

            pdfAttachment = {
              filename,
              content: buffer,
              contentType: 'application/pdf',
            };
          }
        }
      } catch (pdfErr) {
        console.error('Failed to fetch original PDF for attachment:', pdfErr);
      }
    }

    const customerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="background-color: #003399; padding: 22px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #fff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">CarClickBD</h1>
          <p style="color: #f5bd05; margin: 5px 0 0 0; font-weight: bold;">Verified Japanese Auction Sheet Report</p>
        </div>
        
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
          <p style="font-size: 16px; margin-top: 0;">Dear <strong>${name || 'Valued Customer'}</strong>,</p>
          <p>
            Thank you for choosing CarClickBD. ${
              isFree
                ? 'Your Japanese auction sheet report order has been completed successfully with coupon discount (<strong>Free / ০ টাকা</strong>).'
                : `Your payment of <strong>${amountPaidText}</strong> for the Japanese auction sheet verification has been successfully processed.`
            }
          </p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #003399; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; margin-bottom: 12px; color: #003399; font-size: 16px;">Order & Vehicle Summary</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Chassis No:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #0f172a;">${cleanChassis}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Amount Paid:</td>
                <td style="padding: 6px 0; font-weight: bold; color: ${isFree ? '#16a34a' : '#003399'};">${amountPaidText}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Payment Status:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #16a34a;">${isFree ? 'Completed (Coupon Applied)' : 'Successful'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #64748b;">Report Format:</td>
                <td style="padding: 6px 0; color: #334155;">Original Provider True Report (Official PDF)</td>
              </tr>
            </table>
          </div>

          ${
            pdfAttachment
              ? `
              <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: bold;">
                  📎 Authentic Original Report PDF Attached
                </p>
                <p style="margin: 6px 0 0 0; color: #047857; font-size: 13px; line-height: 1.5;">
                  The complete original Japanese auction sheet PDF (<strong>${pdfAttachment.filename}</strong>) is attached to this email. This official, untouched document can be submitted directly for bank verification, car loan processing, or customs record.
                </p>
              </div>
              `
              : ''
          }

          <div style="text-align: center; margin-top: 25px; margin-bottom: 25px;">
            <p style="margin-bottom: 12px; font-size: 14px; color: #475569;">
              ${pdfAttachment ? 'You can also view or download your report online anytime:' : 'Click below to view and download your verified report:'}
            </p>
            <a href="${fallbackDownloadUrl}" style="background-color: #f5bd05; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 15px; display: inline-block;">
              Open Report Online
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
          
          <p style="font-size: 13px; color: #64748b; text-align: center; margin: 0;">
            If you need further assistance with auction sheet translation or understanding the condition notes, please contact our support via WhatsApp.<br><br>
            <strong>CarClickBD Team</strong><br>
            <span style="font-size: 12px; color: #94a3b8;">Dhaka, Bangladesh &bull; carclickbd.com</span>
          </p>
        </div>
      </div>
    `;

    const attachments = pdfAttachment
      ? [
          {
            filename: pdfAttachment.filename,
            content: pdfAttachment.content,
            contentType: 'application/pdf',
          },
        ]
      : [];

    await transporter.sendMail({
      from: `"CarClickBD" <${smtpEmail}>`,
      to: email,
      subject: `CarClickBD Verified True Report Delivery - ${cleanChassis}`,
      html: customerHtml,
      attachments,
    });

    const adminHtml = `
      <h2>New Auction Sheet Order Completed</h2>
      <p><strong>Customer:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobileNumber || 'N/A'}</p>
      <p><strong>Chassis:</strong> ${cleanChassis}</p>
      <p><strong>Amount:</strong> ${amountPaidText} ${isFree ? '(100% Free Coupon)' : ''}</p>
      <p><strong>PDF Attached:</strong> ${pdfAttachment ? `Yes (${pdfAttachment.filename})` : 'No (download link only)'}</p>
      <p><strong>Download URL:</strong> <a href="${fallbackDownloadUrl}">${fallbackDownloadUrl}</a></p>
    `;

    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      smtpEmail;

    await transporter.sendMail({
      from: `"CarClickBD Orders" <${smtpEmail}>`,
      to: adminEmail,
      subject: `[Order Alert] New Auction Sheet ${isFree ? 'Free Coupon' : 'Paid'} - ${cleanChassis}`,
      html: adminHtml,
      attachments,
    });

    return NextResponse.json({
      success: true,
      pdfAttached: Boolean(pdfAttachment),
    });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

