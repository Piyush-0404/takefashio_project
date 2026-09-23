import { describe, expect, it } from 'vitest';
import { mapProductToCard } from './productService';

describe('mapProductToCard', () => {
  it('maps backend product data to the storefront card shape', () => {
    const rawProduct = {
      id: 'prod_123',
      name: 'Linen Relaxed Shirt',
      slug: 'linen-relaxed-shirt',
      brand: 'TakeFashion',
      description: 'Breathable everyday linen shirt.',
      price: '1499',
      category: { name: 'Men', slug: 'men' },
      productImages: [{ imageUrl: 'https://img.example/1.jpg', isPrimary: true }, { imageUrl: 'https://img.example/2.jpg' }],
      variants: [{ size: 'M', color: 'Black', stockQuantity: 10 }, { size: 'L', color: 'Black', stockQuantity: 5 }],
      stock: 15,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
    };

    const mapped = mapProductToCard(rawProduct);

    expect(mapped.id).toBe('prod_123');
    expect(mapped.name).toBe('Linen Relaxed Shirt');
    expect(mapped.price).toBe(1499);
    expect(mapped.originalPrice).toBe(1499);
    expect(mapped.heroImage).toBe('https://img.example/1.jpg');
    expect(mapped.images).toHaveLength(2);
    expect(mapped.sizes).toEqual(['M', 'L']);
    expect(mapped.colors).toEqual(['Black']);
    expect(mapped.isNew).toBe(true);
    expect(mapped.audience).toBe('Men');
  });
});
