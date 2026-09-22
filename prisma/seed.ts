import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const db = new PrismaClient();
const hierarchy = {
  Men: ["Clothing", "Shoes", "Accessories"],
  Women: ["Clothing", "Shoes", "Accessories"],
  Kids: ["Clothing", "Shoes", "Accessories"],
  Jewellery: ["Earrings", "Necklaces", "Bracelets", "Bangles", "Rings", "Jewellery Sets", "Anklets"],
  Accessories: ["Bags", "Shoes", "Watches", "Belts", "Sunglasses", "Wallets"]
} as const;
const products = [
  ["Linen Relaxed Shirt", "linen-relaxed-shirt", "Breathable everyday linen shirt.", 1499, "Men"],
  ["Satin Slip Dress", "satin-slip-dress", "Polished satin dress for evening looks.", 2299, "Women"],
  ["Structured Shoulder Bag", "structured-shoulder-bag", "A compact statement shoulder bag.", 1899, "Accessories"],
  ["Wide Leg Trousers", "wide-leg-trousers", "Tailored trousers with a relaxed silhouette.", 1799, "Women"]
] as const;

async function main() {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    await db.user.upsert({ where: { email: process.env.ADMIN_EMAIL.toLowerCase() }, create: { name: process.env.ADMIN_NAME ?? "TakeFashion Admin", email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash: await argon2.hash(process.env.ADMIN_PASSWORD), role: "ADMIN" }, update: { role: "ADMIN", isActive: true } });
  }
  const categoryMap = new Map<string, string>();
  for (const [parentName, children] of Object.entries(hierarchy)) {
    const parent = await db.category.upsert({ where: { slug: parentName.toLowerCase() }, create: { name: parentName, slug: parentName.toLowerCase() }, update: {} });
    categoryMap.set(parentName, parent.id);
    for (const childName of children) {
      const child = await db.category.upsert({ where: { slug: `${parentName.toLowerCase()}-${childName.toLowerCase().replaceAll(" ", "-")}` }, create: { name: childName, slug: `${parentName.toLowerCase()}-${childName.toLowerCase().replaceAll(" ", "-")}`, parentId: parent.id }, update: { parentId: parent.id } });
      categoryMap.set(`${parentName}/${childName}`, child.id);
    }
  }
  for (const [name, slug, description, price, category] of products) await db.product.upsert({ where: { slug }, create: { name, slug, description, price, basePrice: price, stock: 25, categoryId: categoryMap.get(category)!, isFeatured: true, isNewArrival: true, isTrending: true }, update: { basePrice: price, isNewArrival: true, isTrending: true } });
}
main().finally(() => db.$disconnect());