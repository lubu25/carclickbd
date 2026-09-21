import { NextResponse } from "next/server";
import { getEpsConfig } from "@/lib/epsConfig";

export async function GET(
  _request: Request,
  { params }: { params: { merchantTransactionId: string } },
) {
  try {
    const config = await getEpsConfig();
    const baseUrl = config.apiBaseUrl.replace(/\/$/, "");
    const authResponse = await fetch(`${baseUrl}/v1/Auth/GetToken`, {
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
      `${baseUrl}/v1/EPSEngine/CheckMerchantTransactionStatus?merchantTransactionId=${encodeURIComponent(params.merchantTransactionId)}`,
      {
        headers: Object.assign(
          { "x-hash": config.initHash },
          { Authorization: ["Bearer", token].join(" ") },
        ),
        cache: "no-store",
      },
    );
    const statusPayload = await statusResponse.json();
    return NextResponse.json(statusPayload, { status: statusResponse.status });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "EPS status check failed" }, { status: 500 });
  }
}
