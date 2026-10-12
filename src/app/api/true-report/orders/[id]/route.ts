import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder, deleteOrder } from '@/lib/true-report/orders';
import { verifyEpsPayment } from '@/lib/eps/verify';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // 1. Action: Verify with Gateway in real-time
    if (body.action === 'verify_gateway') {
      const epsResult = await verifyEpsPayment(order.orderId);
      if (epsResult.isSuccess) {
        const updated = updateOrder(order.orderId, {
          paymentStatus: 'PAID',
          paymentVerified: true,
          verificationSource: 'EPS_GATEWAY',
          transactionId: epsResult.transactionId || order.orderId,
          verificationDetails: epsResult.rawResponse,
        });
        return NextResponse.json({
          success: true,
          verified: true,
          message: 'Payment verified with EPS Gateway!',
          data: updated,
        });
      } else {
        const updated = updateOrder(order.orderId, {
          paymentStatus: epsResult.status?.toLowerCase() === 'pending' ? 'PENDING' : 'FAILED',
          paymentVerified: false,
          verificationDetails: epsResult.rawResponse,
        });
        return NextResponse.json({
          success: false,
          verified: false,
          message: epsResult.message || `EPS Gateway status: ${epsResult.status}`,
          data: updated,
        });
      }
    }

    // 2. Manual status update by Admin
    const isPaid = body.paymentStatus === 'PAID';
    const updated = updateOrder(order.orderId, {
      paymentStatus: body.paymentStatus || order.paymentStatus,
      paymentVerified: isPaid,
      verificationSource: isPaid ? 'ADMIN_MANUAL' : order.verificationSource,
      transactionId: body.transactionId || order.transactionId,
      amount: body.amount !== undefined ? Number(body.amount) : order.amount,
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = deleteOrder(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Order not found or could not be deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order record deleted successfully',
    });
  } catch (error: any) {
    console.error('Order delete error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
}
