import { db } from "@/lib/db";
import { errorResponse, ok } from "@/lib/http";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") ?? 12)));
    const search = url.searchParams.get("search")?.trim();
    const category = url.searchParams.get("category");
    const subcategory = url.searchParams.get("subcategory");
    const size = url.searchParams.get("size");
    const color = url.searchParams.get("color");
    const minPriceValue = url.searchParams.get("min_price");
    const maxPriceValue = url.searchParams.get("max_price");
    const minPrice = minPriceValue ? Number(minPriceValue) : null;
    const maxPrice = maxPriceValue ? Number(maxPriceValue) : null;
    const sort = url.searchParams.get("sort");
    const where: Prisma.ProductWhereInput = { isActive: true, ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }, { brand: { contains: search, mode: "insensitive" } }] } : {}), ...(category && !subcategory ? { category: { slug: category } } : {}), ...(category && subcategory ? { category: { parent: { slug: category }, slug: subcategory } } : {}), ...(minPrice !== null && Number.isFinite(minPrice) || maxPrice !== null && Number.isFinite(maxPrice) ? { price: { ...(minPrice !== null && Number.isFinite(minPrice) ? { gte: minPrice } : {}), ...(maxPrice !== null && Number.isFinite(maxPrice) ? { lte: maxPrice } : {}) } } : {}), ...(size || color ? { variants: { some: { isActive: true, ...(size ? { size } : {}), ...(color ? { color } : {}) } } } : {}) };
    const orderBy = sort === "price_asc" ? { price: "asc" as const } : sort === "price_desc" ? { price: "desc" as const } : sort === "newest" ? { createdAt: "desc" as const } : { name: "asc" as const };
    const include = { category: true, productImages: { orderBy: { sortOrder: "asc" as const } }, variants: { where: { isActive: true }, include: { inventory: true } } };
    const [products, total] = await db.$transaction([db.product.findMany({ where, include, orderBy, skip: (page - 1) * limit, take: limit }), db.product.count({ where })]);
    return ok({ products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return errorResponse(error); }
}