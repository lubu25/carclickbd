import { NextResponse } from 'next/server';
import { getOrderById, getOrderByChassis, updateOrder } from '@/lib/true-report/orders';
import { verifyEpsPayment } from '@/lib/eps/verify';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, chassis } = body;

    const cleanOrderId = String(orderId || '').trim();
    const cleanChassis = String(chassis || '').trim().toUpperCase();

    if (!cleanOrderId && !cleanChassis) {
      return NextResponse.json(
        { success: false, verified: false, message: 'Order ID or Chassis is required' },
        { status: 400 }
      );
    }

    let order = cleanOrderId ? getOrderById(cleanOrderId) : undefined;
    if (!order && cleanChassis) {
      order = getOrderByChassis(cleanChassis);
    }

    if (!order) {
      return NextResponse.json(
        { success: false, verified: false, message: 'No payment record found for this order/chassis' },
        { status: 404 }
      );
    }

    // If order was already verified (e.g. valid coupon or previously verified by gateway)
    if (order.paymentVerified && order.paymentStatus === 'PAID') {
      return NextResponse.json({
        success: true,
        verified: true,
        order,
        message: 'Order payment is already verified',
      });
    }

    // If order was 100% coupon discount
    if (order.amount === 0 && order.verificationSource === 'COUPON') {
      updateOrder(order.orderId, {
        paymentStatus: 'PAID',
        paymentVerified: true,
      });
      return NextResponse.json({
        success: true,
        verified: true,
        order,
        message: 'Coupon payment verified',
      });
    }

    // Verify with live/sandbox EPS Payment Gateway
    const epsResult = await verifyEpsPayment(order.orderId);

    if (epsResult.isSuccess) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carclickbd.com';
      const updated = updateOrder(order.orderId, {
        paymentStatus: 'PAID',
        paymentVerified: true,
        verificationSource: 'EPS_GATEWAY',
        transactionId: epsResult.transactionId || order.orderId,
        verificationDetails: epsResult.rawResponse,
        downloadUrl: `${baseUrl}/auction-sheets?status=success&chassis=${encodeURIComponent(order.chassis)}&order=${order.orderId}`,
      });

      return NextResponse.json({
        success: true,
        verified: true,
        order: updated,
        message: 'Payment successfully verified with EPS Gateway',
      });
    } else {
      updateOrder(order.orderId, {
        paymentStatus: epsResult.status?.toLowerCase() === 'pending' ? 'PENDING' : 'FAILED',
        paymentVerified: false,
        verificationDetails: epsResult.rawResponse,
      });

      return NextResponse.json({
        success: false,
        verified: false,
        status: epsResult.status,
        message: epsResult.message || `Payment status from EPS: ${epsResult.status}`,
      });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, verified: false, message: error.message || 'Internal error verifying payment' },
      { status: 500 }
    );
  }
}
