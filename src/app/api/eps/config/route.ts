import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'eps-config.json');

export async function GET() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf8');
      return NextResponse.json({ success: true, data: JSON.parse(data) });
    } else {
      return NextResponse.json({
        success: true,
        data: {
          storeId: '',
          signatureKey: '',
          gatewayUrl: 'https://sandbox.eps.com.bd/payment',
        }
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storeId, signatureKey, gatewayUrl } = body;

    const configData = {
      storeId,
      signatureKey,
      gatewayUrl
    };

    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'EPS Settings saved successfully', data: configData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
