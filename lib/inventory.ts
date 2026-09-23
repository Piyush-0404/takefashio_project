import { Prisma } from "@prisma/client";

export async function deductOrderInventory(tx: Prisma.TransactionClient, orderId: string) {
  const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new Error("ORDER_NOT_FOUND");
  if (order.inventoryDeductedAt) return order;
  for (const item of order.items) {
    if (item.productVariantId) {
      const updated = await tx.productVariant.updateMany({ where: { id: item.productVariantId, stockQuantity: { gte: item.quantity } }, data: { stockQuantity: { decrement: item.quantity } } });
      if (!updated.count) throw new Error("INSUFFICIENT_STOCK");
    } else {
      const updated = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
      if (!updated.count) throw new Error("INSUFFICIENT_STOCK");
    }
  }
  return tx.order.update({ where: { id: orderId }, data: { inventoryDeductedAt: new Date() }, include: { items: true } });
}