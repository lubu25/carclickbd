import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name, chassis, amount, mobileNumber, downloadUrl } = await request.json();

    if (!email || !chassis) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const smtpEmail = process.env.SMTP_EMAIL || process.env.EMAIL;
    const smtpPassword = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD;

    if (!smtpEmail || !smtpPassword) {
      console.error('SMTP credentials not configured in environment variables.');
      return NextResponse.json({ success: false, error: 'Email configuration missing' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this or use host/port if using Hostinger SMTP
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const customerHtml = `
      <h2>Payment Successful for Auction Sheet: ${chassis}</h2>
      <p>Dear ${name || 'Customer'},</p>
      <p>Your payment of ${amount || 750} BDT has been successfully received.</p>
      <p>You can download your auction sheet using the link below:</p>
      <a href="${downloadUrl || 'https://carclickbd.com/auction-sheets?chassis=' + chassis}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Download Auction Sheet</a>
      <p style="margin-top: 20px;">If you face any issues, please contact CarClickBD support.</p>
    `;

    // Fetch PDF to attach
    const attachments: any[] = [];
    try {
      const apiCode = process.env.JPCENTER_API_CODE || process.env.JPCENTER_API_KEY || process.env.JPCENTER_CODE;
      if (apiCode) {
        const lookupUrl = `https://jpcenter.ru/api/report?json=&code=${apiCode}&chassis=${chassis}`;
        const lookupRes = await fetch(lookupUrl, { signal: AbortSignal.timeout(15000) });
        const lookupJson = await lookupRes.json();
        const records = Array.isArray(lookupJson?.aj) ? lookupJson.aj.filter((r: any) => r && typeof r === 'object') : [];
        const record = records.find((item: any) => String(item.key || '').trim());
        
        if (record?.key) {
          const reportUrl = `https://jpcenter.ru/api/report?json=&code=${apiCode}&chassis=${chassis}&key=${record.key}`;
          const reportRes = await fetch(reportUrl, { signal: AbortSignal.timeout(15000) });
          const reportText = await reportRes.text();
          let pdfUrl: string | null = null;
          
          try {
            const reportJson = JSON.parse(reportText);
            const possiblePdf = Object.values(reportJson).find((val: any) => typeof val === 'string' && val.includes('.pdf'));
            if (possiblePdf) pdfUrl = String(possiblePdf);
          } catch (e) {
             const match = reportText.match(/href="([^"]+\.pdf)"/i);
             if (match && match[1]) pdfUrl = String(match[1]);
          }

          if (pdfUrl) {
            const pdfRes = await fetch(pdfUrl, { signal: AbortSignal.timeout(20000) });
            const arrayBuffer = await pdfRes.arrayBuffer();
            attachments.push({
              filename: `auction-sheet-${chassis}.pdf`,
              content: Buffer.from(arrayBuffer),
              contentType: 'application/pdf'
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to attach PDF to email:', err);
    }

    // Send to customer
    await transporter.sendMail({
      from: smtpEmail,
      to: email,
      subject: 'CarClickBD Auction Sheet Delivery - ' + chassis,
      html: customerHtml,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    // Send to admin
    const adminHtml = `
      <h2>New Auction Sheet Order Paid</h2>
      <p><strong>Customer:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobileNumber || 'N/A'}</p>
      <p><strong>Chassis:</strong> ${chassis}</p>
      <p><strong>Amount:</strong> ${amount || 750} BDT</p>
    `;

    await transporter.sendMail({
      from: smtpEmail,
      to: smtpEmail, // Send to admin email (same as sender)
      subject: 'New Auction Sheet Payment - ' + chassis,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
