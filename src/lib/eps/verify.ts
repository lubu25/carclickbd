import crypto from 'crypto';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface EpsConfig {
  merchantId: string;
  storeId: string;
  userName: string;
  password: string;
  hashKey: string;
  isSandbox: boolean;
  isActive: boolean;
}

const getBooleanEnv = (name: string): boolean | undefined => {
  const value = process.env[name]?.trim().toLowerCase();
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

export function loadEpsConfig(): EpsConfig {
  const sandboxEnv = getBooleanEnv('EPS_IS_SANDBOX');
  const activeEnv = getBooleanEnv('EPS_IS_ACTIVE');
  const envConfig: EpsConfig = {
    merchantId: process.env.EPS_MERCHANT_ID || '',
    storeId: process.env.EPS_STORE_ID || '',
    userName: process.env.EPS_USERNAME || '',
    password: process.env.EPS_PASSWORD || '',
    hashKey: process.env.EPS_HASH_KEY || '',
    isSandbox: sandboxEnv ?? false,
    isActive: activeEnv ?? true,
  };

  try {
    const configPath = path.join(process.cwd(), 'eps-config.json');
    if (fs.existsSync(configPath)) {
      const fileData: Partial<EpsConfig> = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return {
        merchantId: fileData.merchantId || envConfig.merchantId,
        storeId: fileData.storeId || envConfig.storeId,
        userName: fileData.userName || envConfig.userName,
        password: fileData.password || envConfig.password,
        hashKey: fileData.hashKey || envConfig.hashKey,
        isSandbox: sandboxEnv ?? fileData.isSandbox ?? envConfig.isSandbox,
        isActive: activeEnv ?? fileData.isActive ?? envConfig.isActive,
      };
    }
  } catch (e) {
    console.warn('[EPS] Could not read eps-config.json, using env vars:', e);
  }

  return envConfig;
}

export function generateHash(value: string, hashKey: string): string {
  const hmac = crypto.createHmac('sha512', Buffer.from(hashKey, 'utf8'));
  hmac.update(value, 'utf8');
  return hmac.digest('base64');
}

export interface EpsVerificationResult {
  isSuccess: boolean;
  status: string; // "Success", "Failed", "Pending", etc.
  transactionId?: string;
  amount?: number;
  rawResponse?: any;
  message?: string;
}

export async function verifyEpsPayment(merchantTransactionId: string): Promise<EpsVerificationResult> {
  const cleanTxnId = merchantTransactionId.trim();
  if (!cleanTxnId) {
    return { isSuccess: false, status: 'INVALID_ID', message: 'Transaction ID is required' };
  }

  const config = loadEpsConfig();

  if (!config.userName || !config.password || !config.hashKey) {
    return { isSuccess: false, status: 'UNCONFIGURED', message: 'EPS Gateway credentials missing' };
  }

  const isSandbox = config.isSandbox;
  const endpoints = {
    GET_TOKEN: isSandbox
      ? 'https://sandbox-pgapi.eps.com.bd/v1/Auth/GetToken'
      : 'https://pgapi.eps.com.bd/v1/Auth/GetToken',
    VERIFY: isSandbox
      ? 'https://sandbox-pgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus'
      : 'https://pgapi.eps.com.bd/v1/EPSEngine/CheckMerchantTransactionStatus',
  };

  try {
    // 1. Get Token
    const authHash = generateHash(config.userName, config.hashKey);
    const tokenRes = await axios.post(
      endpoints.GET_TOKEN,
      {
        userName: config.userName,
        password: config.password,
      },
      {
        headers: { 'x-hash': authHash },
        timeout: 15000,
      }
    );

    const token = tokenRes.data?.token;
    if (!token) {
      throw new Error(tokenRes.data?.errorMessage || 'Failed to authenticate with EPS');
    }

    // 2. Query Transaction Status with EPS
    const verifyHash = generateHash(cleanTxnId, config.hashKey);
    const queryParams = new URLSearchParams({
      merchantTransactionId: cleanTxnId,
    });

    const verifyRes = await axios.get(`${endpoints.VERIFY}?${queryParams.toString()}`, {
      headers: {
        'x-hash': verifyHash,
        Authorization: `Bearer ${token}`,
      },
      timeout: 20000,
    });

    const data = verifyRes.data;

    // Check status in EPS response
    const statusText = String(data?.Status || data?.TransactionStatus || data?.transitionStatus || '').toLowerCase();
    const isSuccess =
      statusText === 'success' ||
      statusText === 'successful' ||
      statusText === 'completed' ||
      statusText === 'paid';

    const transactionId = data?.EPSTransactionId || data?.TransactionId || data?.financialEntityTransactionId || cleanTxnId;
    const amount = Number(data?.TotalAmount || data?.Amount || 0);

    return {
      isSuccess,
      status: data?.Status || (isSuccess ? 'Success' : 'Failed'),
      transactionId,
      amount,
      rawResponse: data,
    };
  } catch (error: any) {
    console.error('EPS Verification Error:', error.response?.data || error.message);
    return {
      isSuccess: false,
      status: 'ERROR',
      message: error.response?.data?.ErrorMessage || error.message || 'Verification request failed',
      rawResponse: error.response?.data,
    };
  }
}
