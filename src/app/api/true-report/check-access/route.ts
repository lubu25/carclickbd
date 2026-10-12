import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, getOrderByChassis, isChassisPaid } from '@/lib/true-report/orders';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chassis = searchParams.get('chassis')?.trim();
  const orderId = searchParams.get('order')?.trim();

  if (!chassis) {
    return NextResponse.json(
      { hasAccess: false, message: 'Chassis number is required' },
      { status: 400 }
    );
  }

  const cleanChassis = chassis.toUpperCase();

  // If orderId is provided, check that specific order first
  if (orderId) {
    const order = getOrderById(orderId);
    if (order && order.chassis.toUpperCase() === cleanChassis) {
      if (order.paymentVerified && order.paymentStatus === 'PAID') {
        return NextResponse.json({
          hasAccess: true,
          chassis: cleanChassis,
          orderId: order.orderId,
          order,
        });
      }
    }
  }

  // Check if this chassis has any verified paid order
  const order = getOrderByChassis(cleanChassis);
  if (order && order.paymentVerified && order.paymentStatus === 'PAID') {
    return NextResponse.json({
      hasAccess: true,
      chassis: cleanChassis,
      orderId: order.orderId,
      order,
    });
  }

  return NextResponse.json({
    hasAccess: false,
    chassis: cleanChassis,
    message: 'Payment verification required to access full True Report',
  });
}
