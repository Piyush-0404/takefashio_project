import PDFDocument from "pdfkit";

type InvoiceOrder = {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: string;
  paymentStatus: string;
  subtotal: unknown;
  discount: unknown;
  shippingFee: unknown;
  tax: unknown;
  total: unknown;
  couponCode: string | null;
  shippingAddress: unknown;
  user: { name: string; email: string };
  items: Array<{ productName: string; sku: string | null; size: string | null; color: string | null; quantity: number; unitPrice: unknown; totalPrice: unknown }>;
  payments: Array<{ provider: string; providerPaymentId: string | null; providerOrderId: string | null; status: string }>;
};

const money = (value: unknown) => `INR ${Number(value || 0).toFixed(2)}`;

export function createInvoicePdf(order: InvoiceOrder) {
  return new Promise<Buffer>((resolve) => {
    const document = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];
    document.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    document.on("end", () => resolve(Buffer.concat(chunks)));

    document.fontSize(24).fillColor("#111827").text("TAKEFASHION");
    document.fontSize(10).fillColor("#6b7280").text("Fashion marketplace invoice");
    document.moveDown();
    document.fontSize(11).fillColor("#111827").text(`Invoice number: ${order.orderNumber}`);
    document.text(`Order ID: ${order.id}`);
    document.text(`Order date: ${new Date(order.createdAt).toLocaleString("en-IN")}`);
    document.moveDown();
    document.fontSize(12).text("Customer");
    document.fontSize(10).text(`${order.user.name} <${order.user.email}>`);
    document.moveDown();
    document.fontSize(12).text("Shipping address");
    const address = order.shippingAddress as Record<string, unknown> | null;
    document.fontSize(10).text([address?.name, address?.line1, address?.line2, address?.city, address?.state, address?.postalCode, address?.country].filter(Boolean).join(", ") || "Address unavailable");
    document.moveDown();
    document.fontSize(12).text("Items");
    document.moveDown(0.4);
    order.items.forEach((item) => {
      const variant = [item.sku, item.size, item.color].filter(Boolean).join(" / ");
      document.fontSize(10).text(`${item.productName}${variant ? ` (${variant})` : ""}  x${item.quantity}  ${money(item.unitPrice)}  =  ${money(item.totalPrice)}`);
    });
    document.moveDown();
    document.fontSize(10).text(`Subtotal: ${money(order.subtotal)}`);
    document.text(`Discount${order.couponCode ? ` (${order.couponCode})` : ""}: -${money(order.discount)}`);
    document.text(`Shipping: ${money(order.shippingFee)}`);
    document.text(`Tax: ${money(order.tax)}`);
    document.fontSize(13).text(`Total: ${money(order.total)}`);
    document.moveDown();
    document.fontSize(10).text(`Order status: ${order.status}`);
    document.text(`Payment status: ${order.paymentStatus}`);
    const payment = order.payments.find((entry) => entry.providerPaymentId || entry.providerOrderId);
    document.text(`Payment provider: ${payment?.provider || "Not recorded"}`);
    document.text(`Payment reference: ${payment?.providerPaymentId || payment?.providerOrderId || "Not available"}`);
    document.end();
  });
}