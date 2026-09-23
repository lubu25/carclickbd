import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface EpsConfig {
  merchantId: string;
  storeId: string;
  userName: string;
  password: string;
  hashKey: string;
  gatewayUrl: string;
  isSandbox: boolean;
  isActive: boolean;
}

function loadEpsConfig(): EpsConfig {
  const fs = require('fs');
  const path = require('path');

  const defaults: EpsConfig = {
    merchantId: process.env.EPS_MERCHANT_ID || '',
    storeId: process.env.EPS_STORE_ID || '',
    userName: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    hashKey: process.env.EPS_HASH_KEY || '',
    gatewayUrl: process.env.EPS_GATEWAY_URL || 'https://sandbox.eps.com.bd/payment',
    isSandbox: true,
    isActive: true,
  };

  try {
    const configPath = path.join(process.cwd(), 'eps-config.json');
    if (fs.existsSync(configPath)) {
      const configData: Partial<EpsConfig> = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return { ...defaults, ...configData };
    }
  } catch (e) {
    console.error('Failed to load EPS config:', e);
  }

  return defaults;
}

function generateEpsHash(params: Record<string, string>, hashKey: string): string {
  // EPS hash: sort params alphabetically, concatenate values, then HMAC-SHA256
  const sortedKeys = Object.keys(params).sort();
  const message = sortedKeys.map((k) => params[k]).join('');
  return crypto.createHmac('sha256', hashKey).update(message).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, chassis, name, email, mobileNumber, address } = body;

    const config = loadEpsConfig();

    if (!config.isActive) {
      return NextResponse.json(
        { success: false, message: 'Payment gateway is currently disabled. Please contact the administrator.' },
        { status: 400 }
      );
    }

    if (!config.merchantId || !config.storeId || !config.userName || !config.password || !config.hashKey) {
      return NextResponse.json(
        { success: false, message: 'Payment gateway is not fully configured. Please set all credentials in the admin panel.' },
        { status: 400 }
      );
    }

    const orderId = `CCB_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Determine callback URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carclickbd.com';
    const successUrl = `${baseUrl}/payments?status=success&order=${orderId}`;
    const failUrl = `${baseUrl}/payments?status=fail&order=${orderId}`;
    const cancelUrl = `${baseUrl}/payments?status=cancel&order=${orderId}`;

    // EPS payment parameters
    const params: Record<string, string> = {
      merchant_id: config.merchantId,
      store_id: config.storeId,
      username: config.userName,
      password: config.password,
      order_id: orderId,
      amount: String(amount),
      currency: 'BDT',
      customer_name: name || '',
      customer_email: email || '',
      customer_mobile: mobileNumber || '',
      customer_address: address || '',
      product_name: `Auction Sheet Verification - ${chassis}`,
      product_info: chassis || '',
      success_url: successUrl,
      fail_url: failUrl,
      cancel_url: cancelUrl,
    };

    // Generate hash/signature
    const hash = generateEpsHash(params, config.hashKey);
    params.hash = hash;

    // Build the payment URL with query params
    const queryString = new URLSearchParams(params).toString();
    const paymentUrl = `${config.gatewayUrl}?${queryString}`;

    return NextResponse.json({
      success: true,
      data: {
        payment_url: paymentUrl,
        orderId,
        params, // include params so frontend can POST to gateway if needed
      },
    });
  } catch (error: any) {
    console.error('EPS checkout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
