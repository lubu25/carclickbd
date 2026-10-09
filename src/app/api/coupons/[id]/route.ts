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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const coupons = getCoupons();
    
    const newCoupons = coupons.filter((c: any) => c.id !== id);
    if (newCoupons.length === coupons.length) {
       return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    
    saveCoupons(newCoupons);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const coupons = getCoupons();
    
    const index = coupons.findIndex((c: any) => c.id === id);
    if (index === -1) {
       return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
    }
    
    coupons[index] = { ...coupons[index], ...body };
    saveCoupons(coupons);
    return NextResponse.json({ success: true, data: coupons[index], message: 'Coupon updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
