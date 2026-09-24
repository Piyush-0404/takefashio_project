import { db } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { parseAnalyticsRange, AnalyticsRange } from "@/lib/analyticsRange";

const paidStatuses: PaymentStatus[] = [PaymentStatus.CAPTURED, PaymentStatus.SUCCESS];
const excludedOrderStatuses: OrderStatus[] = [OrderStatus.CANCELLED, OrderStatus.DECLINED, OrderStatus.PAYMENT_FAILED];

export { parseAnalyticsRange } from "@/lib/analyticsRange";

const qualifyingOrderWhere = (range: AnalyticsRange) => ({
  createdAt: { gte: range.from, lte: range.to },
  paymentStatus: { in: paidStatuses },
  status: { notIn: excludedOrderStatuses },
});

export async function getAnalyticsOverview(range: AnalyticsRange) {
  const orderWhere = qualifyingOrderWhere(range);
  const orders = await db.order.findMany({
    where: orderWhere,
    select: {
      id: true, userId: true, createdAt: true, total: true, subtotal: true, discount: true,
      shippingFee: true, tax: true, status: true, paymentStatus: true, shippingAddress: true,
      items: { select: { productId: true, productName: true, quantity: true, totalPrice: true, product: { select: { category: { select: { id: true, name: true } } } } } },
    },
  });
  const [orderStates, customers, products, categories] = await Promise.all([
    db.order.groupBy({ by: ["status"], where: { createdAt: { gte: range.from, lte: range.to } }, _count: { _all: true } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.product.count({ where: { isActive: true } }),
    db.category.count({ where: { isActive: true } }),
  ]);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const discounts = orders.reduce((sum, order) => sum + Number(order.discount), 0);
  const shipping = orders.reduce((sum, order) => sum + Number(order.shippingFee), 0);
  const tax = orders.reduce((sum, order) => sum + Number(order.tax), 0);
  const refundRecords = await db.payment.aggregate({ where: { refundStatus: "REFUNDED", refundRequestedAt: { gte: range.from, lte: range.to } }, _sum: { refundAmount: true } });
  const refunds = Number(refundRecords._sum.refundAmount || 0);
  const trendMap = new Map<string, { date: string; orders: number; revenue: number }>();
  const productMap = new Map<string, { productId: string; product: string; category: string; units: number; revenue: number; orders: number }>();
  const categoryMap = new Map<string, { categoryId: string; category: string; units: number; revenue: number; orders: number }>();
  const regionMap = new Map<string, { region: string; orders: number; customers: Set<string>; units: number; revenue: number }>();
  for (const order of orders) {
    const date = order.createdAt.toISOString().slice(0, 10);
    const trend = trendMap.get(date) || { date, orders: 0, revenue: 0 };
    trend.orders += 1; trend.revenue += Number(order.total); trendMap.set(date, trend);
    const address = order.shippingAddress as Record<string, unknown>;
    const region = String(address?.state || address?.city || address?.country || "Unknown");
    const regionRow = regionMap.get(region) || { region, orders: 0, customers: new Set<string>(), units: 0, revenue: 0 };
    regionRow.orders += 1; regionRow.customers.add(order.userId); regionRow.revenue += Number(order.total);
    for (const item of order.items) {
      regionRow.units += item.quantity;
      const product = productMap.get(item.productId) || { productId: item.productId, product: item.productName, category: item.product.category.name, units: 0, revenue: 0, orders: 0 };
      product.units += item.quantity; product.revenue += Number(item.totalPrice); product.orders += 1; productMap.set(item.productId, product);
      const category = categoryMap.get(item.product.category.id) || { categoryId: item.product.category.id, category: item.product.category.name, units: 0, revenue: 0, orders: 0 };
      category.units += item.quantity; category.revenue += Number(item.totalPrice); category.orders += 1; categoryMap.set(item.product.category.id, category);
    }
    regionMap.set(region, regionRow);
  }
  const priorOrders = await db.order.findMany({ where: { paymentStatus: { in: paidStatuses }, status: { notIn: excludedOrderStatuses }, createdAt: { lt: range.from } }, select: { userId: true, total: true } });
  const periodCustomers = new Set(orders.map((order) => order.userId));
  const priorCustomerIds = new Set(priorOrders.map((order) => order.userId));
  const firstTime = [...periodCustomers].filter((id) => !priorCustomerIds.has(id)).length;
  const returning = [...periodCustomers].filter((id) => priorCustomerIds.has(id)).length;
  const customerTotals = new Map<string, number>();
  for (const order of priorOrders.concat(orders)) customerTotals.set(order.userId, (customerTotals.get(order.userId) || 0) + Number(order.total));
  const highValue = [...customerTotals.values()].filter((value) => value >= 10000).length;
  const activeCustomerIds = new Set(priorOrders.concat(orders).map((order) => order.userId));
  return {
    range: { from: range.from.toISOString(), to: range.to.toISOString() },
    summary: { grossSales: revenue + discounts, discounts, shipping, tax, refunds, netSales: revenue - refunds, orderCount: orders.length, averageOrderValue: orders.length ? revenue / orders.length : 0, registeredCustomers: customers, customersWithPurchases: activeCustomerIds.size, products, categories, profit: null, profitAvailable: false },
    orders: { byStatus: orderStates.map((row) => ({ status: row.status, count: row._count._all })), completed: orders.length, paymentFailures: orderStates.find((row) => row.status === "PAYMENT_FAILED")?._count._all || 0, refunds },
    customers: { firstTime, returning, noOrders: Math.max(0, customers - activeCustomerIds.size), highValue, segments: { NEW: firstTime, RETURNING: returning, HIGH_VALUE: highValue, ACTIVE: activeCustomerIds.size, INACTIVE: Math.max(0, customers - activeCustomerIds.size) }, definitions: { NEW: "First qualifying purchase in the selected period", RETURNING: "Qualifying purchase in the period and before the period", HIGH_VALUE: "At least INR 10,000 in qualifying order value", INACTIVE: "No qualifying purchase in the selected period" } },
    trend: [...trendMap.values()].sort((a, b) => a.date.localeCompare(b.date)),
    productsPerformance: [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
    categoriesPerformance: [...categoryMap.values()].sort((a, b) => b.revenue - a.revenue),
    regions: [...regionMap.values()].map((row) => ({ ...row, customers: row.customers.size })).sort((a, b) => b.revenue - a.revenue),
  };
}