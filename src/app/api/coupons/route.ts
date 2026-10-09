import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const couponsFilePath = path.join(process.cwd(), 'coupons.json');

function getCoupons() {
  if (!fs.existsSync(couponsFilePath)) {
    return [];
  }
  const data = fs.readFileSync(couponsFilePath, 'utf-8');
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveCoupons(coupons: any[]) {
  fs.writeFileSync(couponsFilePath, JSON.stringify(coupons, null, 2), 'utf-8');
}

export async function GET() {
  const coupons = getCoupons();
  return NextResponse.json({ success: true, data: coupons });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, discountAmount, discountType, isActive } = body;
    
    if (!code || !discountAmount) {
      return NextResponse.json({ success: false, message: 'Code and amount are required' }, { status: 400 });
    }

    const coupons = getCoupons();
    
    if (coupons.find((c: any) => c.code.toLowerCase() === code.toLowerCase())) {
      return NextResponse.json({ success: false, message: 'Coupon code already exists' }, { status: 400 });
    }
    
    const newCoupon = {
      id: Date.now().toString(),
      code: code.toUpperCase(),
      discountAmount: Number(discountAmount),
      discountType: discountType || 'fixed',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString()
    };
    
    coupons.push(newCoupon);
    saveCoupons(coupons);
    
    return NextResponse.json({ success: true, data: newCoupon, message: 'Coupon created successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
