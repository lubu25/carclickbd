import { NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

interface EpsConfig {
  merchantId: string;
  storeId: string;
  userName: string;
  password: string;
  hashKey: string;
  isSandbox: boolean;
  isActive: boolean;
}

/**
 * Loads EPS config.
 * Priority order:
 *  1. Environment variables (set once in Hostinger hPanel → persists across ALL deployments)
 *  2. eps-config.json (admin panel override — only exists until next deploy)
 *
 * This ensures payment gateway NEVER disconnects on deployment
 * as long as env vars are set in Hostinger hPanel.
 */
function loadEpsConfig(): EpsConfig {
  // ── Step 1: Build config from environment variables ──────────────────────
  const envConfig: EpsConfig = {
    merchantId: process.env.EPS_MERCHANT_ID || '',
    storeId: process.env.EPS_STORE_ID || '',
    userName: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    hashKey: process.env.EPS_HASH_KEY || '',
    isSandbox: process.env.EPS_IS_SANDBOX !== 'false', // default: true (sandbox)
    isActive: process.env.EPS_IS_ACTIVE !== 'false',   // default: true (active)
  };

  // ── Step 2: Merge with eps-config.json if it exists (admin panel override) ──
  // NOTE: This file is NOT in git. It only exists if an admin saved settings
  // via the admin panel after the last deployment. If missing, env vars are used.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const configPath = path.join(process.cwd(), 'eps-config.json');
    if (fs.existsSync(configPath)) {
      const fileData: Partial<EpsConfig> = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      // Only override env value if the file has a non-empty value for that field
      return {
        merchantId: fileData.merchantId || envConfig.merchantId,
        storeId: fileData.storeId || envConfig.storeId,
        userName: fileData.userName || envConfig.userName,
        password: fileData.password || envConfig.password,
        hashKey: fileData.hashKey || envConfig.hashKey,
        isSandbox: fileData.isSandbox !== undefined ? fileData.isSandbox : envConfig.isSandbox,
        isActive: fileData.isActive !== undefined ? fileData.isActive : envConfig.isActive,
      };
    }
  } catch (e) {
    console.warn('[EPS] Could not read eps-config.json, using env vars:', e);
  }

  return envConfig;
}

function generateHash(value: string, hashKey: string): string {
  const hmac = crypto.createHmac('sha512', Buffer.from(hashKey, 'utf8'));
  hmac.update(value, 'utf8');
  return hmac.digest('base64');
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
        { success: false, message: 'Payment gateway is not configured. Please set EPS credentials in Hostinger hPanel environment variables.' },
        { status: 400 }
      );
    }

    const isSandbox = config.isSandbox;
    const endpoints = {
      GET_TOKEN: isSandbox
        ? 'https://sandbox-pgapi.eps.com.bd/v1/Auth/GetToken'
        : 'https://pgapi.eps.com.bd/v1/Auth/GetToken',
      INITIALIZE: isSandbox
        ? 'https://sandbox-pgapi.eps.com.bd/v1/EPSEngine/InitializeEPS'
        : 'https://pgapi.eps.com.bd/v1/EPSEngine/InitializeEPS',
    };

    // 1. Get Token
    let token = '';
    try {
      const authHash = generateHash(config.userName, config.hashKey);
      const tokenRes = await axios.post(
        endpoints.GET_TOKEN,
        {
          userName: config.userName,
          password: config.password,
        },
        {
          headers: { 'x-hash': authHash },
        }
      );

      if (tokenRes.data && tokenRes.data.token) {
        token = tokenRes.data.token;
      } else {
        throw new Error(tokenRes.data.errorMessage || 'Failed to authenticate with EPS');
      }
    } catch (authErr: any) {
      console.error('EPS Auth Error:', authErr.response?.data || authErr.message);
      return NextResponse.json({ success: false, message: 'EPS Authentication Failed. Check credentials.' }, { status: 401 });
    }

    // 2. Initialize Payment
    const orderId = `CCB_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carclickbd.com';

    const initHash = generateHash(orderId, config.hashKey);
    const paymentParams = {
      merchantId: config.merchantId,
      storeId: config.storeId,
      CustomerOrderId: orderId,
      merchantTransactionId: orderId,
      transactionTypeId: 1, // WEB
      financialEntityId: 0,
      transitionStatusId: 0,
      totalAmount: Number(amount),
      ipAddress: '0.0.0.0',
      version: '1',
      successUrl: `${baseUrl}/payments?status=success&order=${orderId}`,
      failUrl: `${baseUrl}/payments?status=fail&order=${orderId}`,
      cancelUrl: `${baseUrl}/payments?status=cancel&order=${orderId}`,
      customerName: name || 'Guest User',
      customerEmail: email || 'no-email@example.com',
      CustomerAddress: address || 'Dhaka',
      CustomerCity: 'Dhaka',
      CustomerState: 'Dhaka',
      CustomerPostcode: '1000',
      CustomerCountry: 'BD',
      CustomerPhone: mobileNumber || '01700000000',
      ProductName: chassis ? `Auction Sheet Verification - ${chassis}` : 'CarClickBD Service',
      ProductCategory: 'Service',
      ProductProfile: 'general',
      ShippingMethod: 'NO',
      NoOfItem: '1',
    };

    try {
      const initRes = await axios.post(endpoints.INITIALIZE, paymentParams, {
        headers: {
          'x-hash': initHash,
          Authorization: `Bearer ${token}`,
        },
      });

      const initData = initRes.data;

      if (initData.RedirectURL) {
        return NextResponse.json({
          success: true,
          data: {
            payment_url: initData.RedirectURL,
            orderId,
            eps_data: initData,
          },
        });
      } else {
        throw new Error(initData.ErrorMessage || 'Failed to initialize payment');
      }
    } catch (initErr: any) {
      console.error('EPS Init Error:', initErr.response?.data || initErr.message);
      return NextResponse.json(
        { success: false, message: initErr.response?.data?.ErrorMessage || initErr.message || 'Payment initialization failed' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('EPS checkout error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
