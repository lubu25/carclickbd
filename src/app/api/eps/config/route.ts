import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'eps-config.json');

// Environment variable defaults — these persist across all deployments
function getEnvDefaults() {
  return {
    merchantId: process.env.EPS_MERCHANT_ID || '',
    storeId: process.env.EPS_STORE_ID || '',
    userName: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    hashKey: process.env.EPS_HASH_KEY || '',
    gatewayUrl:
      process.env.EPS_IS_SANDBOX === 'false'
        ? 'https://eps.com.bd/payment'
        : 'https://sandbox.eps.com.bd/payment',
    isSandbox: process.env.EPS_IS_SANDBOX !== 'false',
    isActive: process.env.EPS_IS_ACTIVE !== 'false',
  };
}

export async function GET() {
  try {
    // Start with environment variable defaults (always available after deploy)
    const defaults = getEnvDefaults();

    // If a local override file exists, merge it on top
    if (fs.existsSync(configFilePath)) {
      try {
        const data = fs.readFileSync(configFilePath, 'utf8');
        const parsed = JSON.parse(data);
        return NextResponse.json({ success: true, data: { ...defaults, ...parsed } });
      } catch {
        // If file is corrupted, fall back to env defaults
      }
    }

    return NextResponse.json({ success: true, data: defaults });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantId, storeId, userName, password, hashKey, gatewayUrl, isSandbox, isActive } = body;

    const configData = {
      merchantId: merchantId || '',
      storeId: storeId || '',
      userName: userName || '',
      password: password || '',
      hashKey: hashKey || '',
      gatewayUrl: gatewayUrl || 'https://sandbox.eps.com.bd/payment',
      isSandbox: isSandbox !== undefined ? isSandbox : true,
      isActive: isActive !== undefined ? isActive : true,
    };

    // Save as a local override file for runtime changes
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'EPS Settings saved successfully', data: configData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
