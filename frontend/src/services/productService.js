import { apiClient } from './apiClient';

const toNumber = (value, fallback = 0) => {
  const num = Number(value ?? fallback);
  return Number.isFinite(num) ? num : fallback;
};

const getPrimaryImage = (product) => {
  const images = Array.isArray(product?.productImages) ? product.productImages : [];
  const primary = images.find((image) => image?.isPrimary) || images[0];
  return primary?.imageUrl || product?.imageUrl || product?.heroImage || '';
};

const getImages = (product) => {
  const images = Array.isArray(product?.productImages) ? product.productImages.map((image) => image?.imageUrl).filter(Boolean) : [];
  if (images.length) return images;
  if (Array.isArray(product?.images)) return product.images.filter(Boolean);
  if (product?.imageUrl) return [product.imageUrl];
  return [];
};

const getSizes = (product) => {
  const sizes = (product?.variants || [])
    .map((variant) => variant?.size)
    .filter((value) => typeof value === 'string' && value.trim().length > 0);
  return [...new Set(sizes)];
};

const getVariants = (product) => (product?.variants || []).map((variant) => ({
  id: variant?.id,
  sku: variant?.sku,
  size: variant?.size,
  color: variant?.color,
  price: toNumber(variant?.price, toNumber(product?.price, 0)),
  stockQuantity: Number(variant?.stockQuantity || 0),
}));

const getColors = (product) => {
  const colors = (product?.variants || [])
    .map((variant) => variant?.color)
    .filter((value) => typeof value === 'string' && value.trim().length > 0);
  return [...new Set(colors)];
};

export function mapProductToCard(product) {
  const categoryName = product?.category?.name || product?.categoryName || product?.category || 'TakeFashion';
  const price = toNumber(product?.price, 0);
  const originalPrice = toNumber(product?.salePrice ?? product?.compareAt ?? product?.basePrice ?? product?.price, price);
  const badge = product?.isFeatured ? 'FEATURED' : product?.isTrending ? 'TRENDING' : product?.isNewArrival ? 'NEW ARRIVAL' : 'BESTSELLER';
  const name = product?.name || 'TakeFashion Product';
  const heroImage = getPrimaryImage(product);

  return {
    id: product?.id,
    slug: product?.slug,
    name,
    description: product?.description || '',
    tagline: product?.tagline || product?.description || 'TakeFashion collection essential',
    brand: product?.brand || 'TakeFashion',
    price,
    originalPrice: originalPrice > price ? originalPrice : price,
    rating: 4.8,
    reviewsCount: 42,
    badge,
    isNew: Boolean(product?.isNewArrival),
    isAntiTarnish: false,
    heroImage,
    images: getImages(product),
    category: categoryName,
    subcategory: product?.subcategory || product?.category?.name || 'Featured',
    audience: categoryName,
    department: categoryName,
    sizes: getSizes(product),
    colors: getColors(product),
    variants: getVariants(product),
    stock: Number(product?.stock ?? product?.variants?.reduce((sum, item) => sum + Number(item?.stockQuantity || 0), 0) ?? 0),
    inStock: Number(product?.stock ?? product?.variants?.reduce((sum, item) => sum + Number(item?.stockQuantity || 0), 0) ?? 0) > 0,
  };
}

export async function listProducts(params = {}) {
  const payload = await apiClient.get('/api/products', params);
  const products = Array.isArray(payload?.products) ? payload.products.map(mapProductToCard) : [];
  return {
    products,
    pagination: payload?.pagination || null,
  };
}

export async function getProduct(productId) {
  const payload = await apiClient.get(`/api/products/${productId}`);
  return mapProductToCard(payload?.product);
}

export async function getCategoryTree() {
  const payload = await apiClient.get('/api/categories');
  return payload?.categories || [];
}

export async function getCategoryChildren(slug) {
  const payload = await apiClient.get(`/api/categories/${slug}/children`);
  return payload?.categories || [];
}

export async function searchProducts(query) {
  if (!query || !String(query).trim()) return listProducts();
  return listProducts({ search: String(query).trim(), page: 1, limit: 20 });
}
