import { NextResponse } from "next/server";
import { getEpsConfig } from "@/lib/epsConfig";

const readValue = (payload: any, ...keys: string[]) => {
  for (const key of keys) {
    if (payload?.[key]) return payload[key];
    if (payload?.data?.[key]) return payload.data[key];
    if (payload?.result?.[key]) return payload.result[key];
  }
  return undefined;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const config = await getEpsConfig();
    const required = (value: string, name: string) => {
      if (!value) throw new Error(`Missing ${name} EPS setting`);
      return value;
    };
    const epsBaseUrl = (body.gateway_mode === "live" ? config.liveApiBaseUrl : config.apiBaseUrl).replace(/\/$/, "");
    const replaceTokens = (template: string, fallback: string, transactionId: string) =>
      (template || fallback)
        .replaceAll("{token}", encodeURIComponent(transactionId))
        .replaceAll("{order}", encodeURIComponent(String(body.order || "")));
    const authResponse = await fetch(`${epsBaseUrl}/v1/Auth/GetToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-hash": required(config.authHash, "auth hash") },
      body: JSON.stringify({
        userName: required(config.username, "username"),
        password: required(config.password, "password"),
      }),
      cache: "no-store",
    });
    const authPayload = await authResponse.json();
    const token = readValue(authPayload, "token", "Token", "access_token", "accessToken");

    if (!authResponse.ok || !token) {
      return NextResponse.json({ message: "EPS authentication failed", details: authPayload }, { status: 502 });
    }

    const merchantTransactionId = body.merchantTransactionId || `CCBD-${Date.now()}`;
    const amount = Number(body.amount || 0);
    if (amount < config.minimumAmount || amount > config.maximumAmount) {
      return NextResponse.json({ message: `EPS payment amount must be between ${config.minimumAmount} and ${config.maximumAmount} BDT` }, { status: 400 });
    }
    const initPayload = {
      storeId: required(config.storeId, "store ID"),
      merchantTransactionId,
      CustomerOrderId: body.order,
      transactionTypeId: 10,
      financialEntityId: 0,
      transitionStatusId: 0,
      totalAmount: amount,
      ipAddress: body.ipAddress || "",
      version: "",
      successUrl: replaceTokens(config.successUrl, body.success_url, merchantTransactionId),
      failUrl: replaceTokens(config.failUrl, body.fail_url, merchantTransactionId),
      cancelUrl: replaceTokens(config.cancelUrl, body.cancel_url, merchantTransactionId),
      customerName: body.customerName || "CarClickBD Customer",
      customerEmail: body.customerEmail || "",
      customerAddress: body.customerAddress || "",
      customerAddress2: "",
      customerCity: body.customerCity || "",
      customerState: "",
      customerPostcode: body.customerPostcode || "",
      customerCountry: "Bangladesh",
      customerPhone: body.customerPhone || "",
      shipmentName: body.customerName || "CarClickBD Customer",
      shipmentAddress: body.customerAddress || "",
      shipmentAddress2: "",
      shipmentCity: body.customerCity || "",
      shipmentState: "",
      shipmentPostcode: body.customerPostcode || "",
      shipmentCountry: "Bangladesh",
      valueA: body.order,
      valueB: "CarClickBD",
      valueC: "",
      valueD: "",
      shippingMethod: "",
      noOfItem: "1",
      productName: "CarClickBD Order",
      productProfile: "Vehicle marketplace order",
      productCategory: "Vehicle",
      ProductList: [],
    };

    const initResponse = await fetch(`${epsBaseUrl}/v1/EPSEngine/InitializeEPS`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-hash": required(config.initHash, "initialize hash"),
      },
      body: JSON.stringify(initPayload),
      cache: "no-store",
    });
    const initResult = await initResponse.json();
    const paymentUrl = readValue(initResult, "payment_url", "paymentUrl", "redirectUri", "redirectUrl", "checkout_url");

    if (!initResponse.ok || !paymentUrl) {
      return NextResponse.json({ message: "EPS payment URL was not returned", details: initResult }, { status: 502 });
    }

    return NextResponse.json({ data: { payment_url: paymentUrl, token: merchantTransactionId } });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "EPS initialization failed" }, { status: 500 });
  }
}