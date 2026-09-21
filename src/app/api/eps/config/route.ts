import { NextResponse } from "next/server";
import { getEpsConfig, maskSecret, saveEpsConfig, type EpsServerConfig } from "@/lib/epsConfig";

export async function GET() {
  const config = await getEpsConfig();
  return NextResponse.json({
    data: {
      apiBaseUrl: config.apiBaseUrl,
      liveApiBaseUrl: config.liveApiBaseUrl,
      merchantId: config.merchantId,
      username: config.username,
      storeId: config.storeId,
      password: maskSecret(config.password),
      apiKey: maskSecret(config.apiKey),
      apiSecret: maskSecret(config.apiSecret),
      authHash: maskSecret(config.authHash),
      initHash: maskSecret(config.initHash),
      successUrl: config.successUrl,
      failUrl: config.failUrl,
      cancelUrl: config.cancelUrl,
      ipnUrl: config.ipnUrl,
      displayLabel: config.displayLabel,
      logoUrl: config.logoUrl,
      minimumAmount: config.minimumAmount,
      maximumAmount: config.maximumAmount,
      shortDescription: config.shortDescription,
      customerInstructions: config.customerInstructions,
      configured: Boolean(config.username && config.password && config.authHash && config.initHash && config.storeId),
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await getEpsConfig();
    const nextConfig: EpsServerConfig = {
      apiBaseUrl: String(body.apiBaseUrl || current.apiBaseUrl || "https://sandboxpgapi.eps.com.bd").replace(/\/$/, ""),
      liveApiBaseUrl: String(body.liveApiBaseUrl || current.liveApiBaseUrl || "https://pgapi.eps.com.bd").replace(/\/$/, ""),
      merchantId: String(body.merchantId || "").trim(),
      username: String(body.username || "").trim(),
      password: body.password?.includes("********") ? current.password : String(body.password || ""),
      apiKey: body.apiKey?.includes("********") ? current.apiKey : String(body.apiKey || ""),
      apiSecret: body.apiSecret?.includes("********") ? current.apiSecret : String(body.apiSecret || ""),
      authHash: body.authHash?.includes("********") ? current.authHash : String(body.authHash || ""),
      initHash: body.initHash?.includes("********") ? current.initHash : String(body.initHash || ""),
      storeId: String(body.storeId || "").trim(),
      successUrl: String(body.successUrl || "").trim(),
      failUrl: String(body.failUrl || "").trim(),
      cancelUrl: String(body.cancelUrl || "").trim(),
      ipnUrl: String(body.ipnUrl || "").trim(),
      displayLabel: String(body.displayLabel || "EPS Secure Payment").trim(),
      logoUrl: String(body.logoUrl || "").trim(),
      minimumAmount: Number(body.minimumAmount || 1),
      maximumAmount: Number(body.maximumAmount || 500000),
      shortDescription: String(body.shortDescription || "Pay securely through EPS.").trim(),
      customerInstructions: String(body.customerInstructions || "You will be redirected to EPS to complete payment.").trim(),
    };

    if (!nextConfig.username || !nextConfig.password || !nextConfig.authHash || !nextConfig.initHash || !nextConfig.storeId) {
      return NextResponse.json({ message: "All EPS credentials are required" }, { status: 400 });
    }

    await saveEpsConfig(nextConfig);
    return NextResponse.json({ message: "EPS configuration saved", configured: true });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Could not save EPS configuration" }, { status: 500 });
  }
}