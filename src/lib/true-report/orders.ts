import fs from 'fs';
import path from 'path';

export interface TrueReportOrder {
  id: string; // Order ID (e.g. CCB_...)
  orderId: string; // EPS merchantTransactionId
  transactionId?: string; // EPS EPSTransactionId
  chassis: string; // Normalized uppercase chassis
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  amount: number;
  originalPrice: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: string; // "EPS", "Coupon (100% OFF)", "Manual Admin Approval"
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  paymentVerified: boolean;
  verificationSource: "EPS_GATEWAY" | "COUPON" | "ADMIN_MANUAL" | "UNVERIFIED";
  verificationDetails?: any;
  reportKey?: string;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'true-report-orders.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function getAllOrders(): TrueReportOrder[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error reading true-report-orders.json:', err);
    return [];
  }
}

export function saveOrders(orders: TrueReportOrder[]): boolean {
  try {
    ensureDataFile();
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving true-report-orders.json:', err);
    return false;
  }
}

export function getOrderById(orderId: string): TrueReportOrder | undefined {
  if (!orderId) return undefined;
  const cleanId = orderId.trim();
  const orders = getAllOrders();
  return orders.find(
    (o) => o.id === cleanId || o.orderId === cleanId || o.transactionId === cleanId
  );
}

export function getOrderByChassis(chassis: string): TrueReportOrder | undefined {
  if (!chassis) return undefined;
  const cleanChassis = chassis.trim().toUpperCase();
  const orders = getAllOrders();
  // Return the latest verified order first, or latest pending order
  const matches = orders.filter((o) => o.chassis.toUpperCase() === cleanChassis);
  const paidMatch = matches.find((o) => o.paymentVerified && o.paymentStatus === 'PAID');
  if (paidMatch) return paidMatch;
  return matches[matches.length - 1];
}

export function isChassisPaid(chassis: string): boolean {
  if (!chassis) return false;
  const cleanChassis = chassis.trim().toUpperCase();
  const orders = getAllOrders();
  return orders.some(
    (o) => o.chassis.toUpperCase() === cleanChassis && o.paymentVerified && o.paymentStatus === 'PAID'
  );
}

export function createOrder(data: Partial<TrueReportOrder> & { chassis: string; amount: number }): TrueReportOrder {
  const orders = getAllOrders();
  const now = new Date().toISOString();
  const orderId = data.orderId || data.id || `CCB_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const newOrder: TrueReportOrder = {
    id: orderId,
    orderId,
    transactionId: data.transactionId || '',
    chassis: data.chassis.trim().toUpperCase(),
    customerName: data.customerName || 'Guest User',
    customerEmail: data.customerEmail || '',
    customerPhone: data.customerPhone || '',
    customerAddress: data.customerAddress || '',
    amount: Number(data.amount) || 0,
    originalPrice: Number(data.originalPrice) || 500,
    discountAmount: Number(data.discountAmount) || 0,
    couponCode: data.couponCode || '',
    paymentMethod: data.paymentMethod || 'EPS',
    paymentStatus: data.paymentStatus || 'PENDING',
    paymentVerified: Boolean(data.paymentVerified),
    verificationSource: data.verificationSource || 'UNVERIFIED',
    verificationDetails: data.verificationDetails || null,
    reportKey: data.reportKey || '',
    downloadUrl: data.downloadUrl || '',
    createdAt: now,
    updatedAt: now,
  };

  // Prepend new order to list so newest appears first
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function updateOrder(orderId: string, updates: Partial<TrueReportOrder>): TrueReportOrder | null {
  const orders = getAllOrders();
  const index = orders.findIndex(
    (o) => o.id === orderId || o.orderId === orderId || (o.transactionId && o.transactionId === orderId)
  );
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveOrders(orders);
  return orders[index];
}

export function deleteOrder(orderId: string): boolean {
  const orders = getAllOrders();
  const filtered = orders.filter((o) => o.id !== orderId && o.orderId !== orderId);
  if (filtered.length === orders.length) return false;
  return saveOrders(filtered);
}
