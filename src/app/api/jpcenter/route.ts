import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chassis = searchParams.get("chassis");

  if (!chassis) {
    return NextResponse.json({ error: "Chassis is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://jpcenter.ru/api/report?chassis=${encodeURIComponent(
        chassis
      )}&code=3574926_42351f64ee17f62f8729d3d527c35dca`
    );

    if (!response.ok) {
      return new NextResponse(await response.text(), {
        status: response.status,
      });
    }

    const xmlText = await response.text();
    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
