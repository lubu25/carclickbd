import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type EpsServerConfig = {
  apiBaseUrl: string;
  liveApiBaseUrl: string;
  merchantId: string;
  username: string;
  password: string;
  apiKey: string;
  apiSecret: string;
  authHash: string;
  initHash: string;
  storeId: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  ipnUrl: string;
  displayLabel: string;
  logoUrl: string;
  minimumAmount: number;
  maximumAmount: number;
  shortDescription: string;
  customerInstructions: string;
  enabled: boolean;
  mode: 'sandbox' | 'live';
};

const configPath = path.join(process.cwd(), ".data", "eps-config.json");

const defaultConfig = (): EpsServerConfig => ({
  apiBaseUrl: process.env.EPS_API_BASE_URL || "https://sandboxpgapi.eps.com.bd",
  liveApiBaseUrl: process.env.EPS_LIVE_API_BASE_URL || "https://pgapi.eps.com.bd",
  merchantId: process.env.EPS_MERCHANT_ID || "",
  username: process.env.EPS_USERNAME || "xyz.eps@gmail.com",
  password: process.env.EPS_PASSWORD || "Emon258@",
  apiKey: process.env.EPS_API_KEY || "",
  apiSecret: process.env.EPS_API_SECRET || "",
  authHash: process.env.EPS_AUTH_HASH || "iRbuoCMiOwQIIXyEvq30l61J+XAq0D/htjKQwiZl4jn7szmMMJTNL7ua0iej2Jtw2ch+D+/uBQ7WgZKcf8hQ8w==",
  initHash: process.env.EPS_INIT_HASH || "P0jzXSQU+ea41Ho+LX6UTgikdMCX8UeqQyZpcm+YoI+jWvWewDIHYXnF8Ji/2rv0xkJxJR9avLoVzpCWUEjTTg==",
  storeId: process.env.EPS_STORE_ID || "35b518f6-aab7-4af1-b16c-335052e9a55c",
  successUrl: process.env.EPS_SUCCESS_URL || "",
  failUrl: process.env.EPS_FAIL_URL || "",
  cancelUrl: process.env.EPS_CANCEL_URL || "",
  ipnUrl: process.env.EPS_IPN_URL || "",
  displayLabel: "EPS Secure Payment",
  logoUrl: "",
  minimumAmount: 1,
  maximumAmount: 500000,
  shortDescription: "Pay securely through EPS.",
  customerInstructions: "You will be redirected to EPS to complete payment.",
  enabled: true,
  mode: "sandbox",
});

export const getEpsConfig = async (): Promise<EpsServerConfig> => {
  try {
    const file = await readFile(configPath, "utf8");
    const stored = JSON.parse(file) as Partial<EpsServerConfig>;
    const defaults = defaultConfig();
    return {
      ...defaults,
      ...stored,
      apiBaseUrl: stored.apiBaseUrl || defaults.apiBaseUrl,
      liveApiBaseUrl: stored.liveApiBaseUrl || defaults.liveApiBaseUrl,
      merchantId: stored.merchantId || defaults.merchantId,
      username: stored.username || defaults.username,
      password: stored.password || defaults.password,
      authHash: stored.authHash || defaults.authHash,
      initHash: stored.initHash || defaults.initHash,
      storeId: stored.storeId || defaults.storeId,
      enabled: stored.enabled !== undefined ? stored.enabled : defaults.enabled,
      mode: stored.mode || defaults.mode,
    };
  } catch {
    return defaultConfig();
  }
};

export const saveEpsConfig = async (config: EpsServerConfig) => {
  await mkdir(path.dirname(configPath), { recursive: true });
  await writeFile(configPath, JSON.stringify(config, null, 2), { encoding: "utf8", mode: 0o600 });
};

export const maskSecret = (value: string) => (value ? `${value.slice(0, 4)}********` : "");