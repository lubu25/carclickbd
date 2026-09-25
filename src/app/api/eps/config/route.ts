import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'eps-config.json');

/**
 * Returns the current EPS config.
 *
 * Source priority:
 *  1. Environment variables  ← permanent, set once in Hostinger hPanel
 *  2. eps-config.json        ← optional admin override (lost on redeploy, env vars take over)
 *
 * Empty string fields in eps-config.json are filled in from env vars,
 * so a partial admin save never breaks the gateway.
 */
function buildConfig() {
  const envConfig = {
    merchantId: process.env.EPS_MERCHANT_ID || '',
    storeId: process.env.EPS_STORE_ID || '',
    userName: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    hashKey: process.env.EPS_HASH_KEY || '',
    isSandbox: process.env.EPS_IS_SANDBOX !== 'false',
    isActive: process.env.EPS_IS_ACTIVE !== 'false',
    gatewayUrl:
      process.env.EPS_IS_SANDBOX !== 'false'
        ? 'https://sandbox.eps.com.bd/payment'
        : 'https://eps.com.bd/payment',
  };

  if (fs.existsSync(configFilePath)) {
    try {
      const file = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
      return {
        merchantId: file.merchantId || envConfig.merchantId,
        storeId: file.storeId || envConfig.storeId,
        userName: file.userName || envConfig.userName,
        password: file.password || envConfig.password,
        hashKey: file.hashKey || envConfig.hashKey,
        isSandbox: file.isSandbox !== undefined ? file.isSandbox : envConfig.isSandbox,
        isActive: file.isActive !== undefined ? file.isActive : envConfig.isActive,
        gatewayUrl: file.gatewayUrl || envConfig.gatewayUrl,
      };
    } catch {
      // Corrupted file → fall back to env vars
    }
  }

  return envConfig;
}

export async function GET() {
  try {
    const config = buildConfig();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantId, storeId, userName, password, hashKey, gatewayUrl, isSandbox, isActive } = body;

    // Build merged config: admin values on top of env var defaults.
    // This means even if the admin leaves a field blank, the env var fills it in.
    const envDefaults = buildConfig();
    const configData = {
      merchantId: merchantId || envDefaults.merchantId,
      storeId: storeId || envDefaults.storeId,
      userName: userName || envDefaults.userName,
      password: password || envDefaults.password,
      hashKey: hashKey || envDefaults.hashKey,
      gatewayUrl: gatewayUrl || envDefaults.gatewayUrl,
      isSandbox: isSandbox !== undefined ? isSandbox : envDefaults.isSandbox,
      isActive: isActive !== undefined ? isActive : envDefaults.isActive,
    };

    // Persist as a local override for the current deployment session.
    // After the next deployment, env vars automatically take over again.
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'EPS Settings saved successfully', data: configData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
