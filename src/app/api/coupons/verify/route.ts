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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, amount } = body;
    
    if (!code) {
      return NextResponse.json({ success: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const coupons = getCoupons();
    const coupon = coupons.find((c: any) => c.code.toLowerCase() === code.toLowerCase() && c.isActive);
    
    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid or inactive coupon' }, { status: 400 });
    }
    
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (Number(amount) * Number(coupon.discountAmount)) / 100;
    } else {
      discount = Number(coupon.discountAmount);
    }
    
    if (discount > Number(amount)) {
      discount = Number(amount);
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        code: coupon.code,
        discount: discount,
        finalAmount: Number(amount) - discount
      }, 
      message: 'Coupon applied successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
