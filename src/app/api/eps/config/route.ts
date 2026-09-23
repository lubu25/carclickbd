import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'eps-config.json');

const defaultConfig = {
  merchantId: '',
  storeId: '',
  userName: '',
  password: '',
  hashKey: '',
  gatewayUrl: 'https://sandbox.eps.com.bd/payment',
  isSandbox: true,
  isActive: true,
};

export async function GET() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf8');
      const parsed = JSON.parse(data);
      // Merge with defaults to ensure all fields exist
      return NextResponse.json({ success: true, data: { ...defaultConfig, ...parsed } });
    } else {
      return NextResponse.json({ success: true, data: defaultConfig });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchantId, storeId, userName, password, hashKey, gatewayUrl, isSandbox, isActive } = body;

    const configData = {
      merchantId: merchantId || '',
      storeId: storeId || '',
      userName: userName || '',
      password: password || '',
      hashKey: hashKey || '',
      gatewayUrl: gatewayUrl || 'https://sandbox.eps.com.bd/payment',
      isSandbox: isSandbox !== undefined ? isSandbox : true,
      isActive: isActive !== undefined ? isActive : true,
    };

    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'EPS Settings saved successfully', data: configData });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
