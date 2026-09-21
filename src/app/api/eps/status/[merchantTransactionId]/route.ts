import { NextResponse } from "next/server";
import { getEpsConfig } from "@/lib/epsConfig";

export async function GET(
  _request: Request,
  { params }: { params: { merchantTransactionId: string } },
) {
  try {
    const config = await getEpsConfig();
    const epsBaseUrl = config.apiBaseUrl.replace(/\/$/, "");
    const authResponse = await fetch(`${epsBaseUrl}/v1/Auth/GetToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-hash": config.authHash },
      body: JSON.stringify({ userName: config.username, password: config.password }),
      cache: "no-store",
    });
    const authPayload = await authResponse.json();
    const token = authPayload?.token || authPayload?.Token || authPayload?.data?.token;

    if (!authResponse.ok || !token) {
      return NextResponse.json({ message: "EPS authentication failed", details: authPayload }, { status: 502 });
    }

    const statusResponse = await fetch(
      `${epsBaseUrl}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${encodeURIComponent(params.merchantTransactionId)}`,
      {
        headers: { Authorization: `Bearer ${token}`, "x-hash": config.initHash },
        cache: "no-store",
      },
    );
    const statusPayload = await statusResponse.json();
    return NextResponse.json(statusPayload, { status: statusResponse.status });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "EPS status check failed" }, { status: 500 });
  }
}