import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, createOrder } from '@/lib/true-report/orders';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim().toLowerCase() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || 'ALL';

    let orders = getAllOrders();

    // Calculate metrics before filtering
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.paymentVerified && o.paymentStatus === 'PAID').length;
    const pendingOrders = orders.filter((o) => o.paymentStatus === 'PENDING').length;
    const failedOrders = orders.filter((o) => o.paymentStatus === 'FAILED' || o.paymentStatus === 'CANCELLED').length;
    const totalRevenue = orders
      .filter((o) => o.paymentVerified && o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    // Apply status filter
    if (status !== 'ALL') {
      if (status === 'PAID' || status === 'VERIFIED') {
        orders = orders.filter((o) => o.paymentVerified && o.paymentStatus === 'PAID');
      } else if (status === 'PENDING') {
        orders = orders.filter((o) => o.paymentStatus === 'PENDING');
      } else if (status === 'FAILED') {
        orders = orders.filter((o) => o.paymentStatus === 'FAILED' || o.paymentStatus === 'CANCELLED');
      } else if (status === 'COUPON') {
        orders = orders.filter((o) => o.verificationSource === 'COUPON');
      }
    }

    // Apply search filter
    if (search) {
      orders = orders.filter((o) => {
        return (
          o.chassis?.toLowerCase().includes(search) ||
          o.orderId?.toLowerCase().includes(search) ||
          o.transactionId?.toLowerCase().includes(search) ||
          o.customerName?.toLowerCase().includes(search) ||
          o.customerEmail?.toLowerCase().includes(search) ||
          o.customerPhone?.toLowerCase().includes(search) ||
          o.couponCode?.toLowerCase().includes(search)
        );
      });
    }

    return NextResponse.json({
      success: true,
      data: orders,
      meta: {
        totalOrders,
        paidOrders,
        pendingOrders,
        failedOrders,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Error fetching True Report orders:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      chassis,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      paymentMethod,
      paymentStatus,
    } = body;

    const cleanChassis = String(chassis || '').trim().toUpperCase();
    if (!cleanChassis) {
      return NextResponse.json(
        { success: false, message: 'Chassis number is required' },
        { status: 400 }
      );
    }

    const isPaid = paymentStatus === 'PAID';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://carclickbd.com';
    const orderId = `ADMIN_${Date.now()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newOrder = createOrder({
      orderId,
      chassis: cleanChassis,
      customerName: customerName || 'Admin Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      amount: Number(amount) || 0,
      originalPrice: 500,
      discountAmount: Math.max(0, 500 - (Number(amount) || 0)),
      paymentMethod: paymentMethod || 'Manual Admin Approval',
      paymentStatus: isPaid ? 'PAID' : 'PENDING',
      paymentVerified: isPaid,
      verificationSource: 'ADMIN_MANUAL',
      downloadUrl: `${baseUrl}/auction-sheets?status=success&chassis=${encodeURIComponent(cleanChassis)}&order=${orderId}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully by Admin',
      data: newOrder,
    });
  } catch (error: any) {
    console.error('Admin order create error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
