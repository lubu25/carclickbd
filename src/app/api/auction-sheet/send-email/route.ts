import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT, // true for 465 (SSL)
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    const fallbackDownloadUrl =
      downloadUrl ||
      `https://carclickbd.com/auction-sheets?status=success&chassis=${encodeURIComponent(chassis)}`;

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
            </table>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <p>Open your auction sheet report below:</p>
            <a href="${fallbackDownloadUrl}" style="background-color: #f5bd05; color: #000; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;">Open Report</a>
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
    });

    const adminHtml = `
      <h2>New Auction Sheet Order Paid</h2>
      <p><strong>Customer:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${mobileNumber || 'N/A'}</p>
      <p><strong>Chassis:</strong> ${chassis}</p>
      <p><strong>Amount:</strong> ${amount || 10} BDT</p>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || smtpEmail;

    await transporter.sendMail({
      from: smtpEmail,
      to: adminEmail,
      subject: 'New Auction Sheet Payment - ' + chassis,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
