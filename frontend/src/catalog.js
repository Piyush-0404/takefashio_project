import { PRODUCTS as JEWELLERY_DATA } from './data.js';

const productDefaults = {
  brand: 'TakeFashion',
  originalPrice: 2499,
  rating: 4.8,
  reviewsCount: 42,
  badge: 'NEW ARRIVAL',
  isNew: true,
  isAntiTarnish: false,
  finish: 'Premium Crafted',
  material: 'Premium organic cotton blend / fine craftsmanship',
  waterproof: 'Easy care / durable finish',
  inStock: true,
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['#0f172a', '#64748b', '#d41472'],
  description: 'A signature TakeFashion design engineered for effortless modern style and day-long comfort.',
  techSpecs: ['Tailored contemporary fit', 'High-resilience construction', 'Designed in India with precision detailing'],
  styleTip: 'Pair with relaxed neutrals and our signature accessories for a cohesive look.'
};

const fashionCatalogData = [
  // MEN - CLOTHING
  {
    id: 'mf-tshirt-01',
    name: 'Essential Heavyweight Oversized Tee',
    audience: 'Men',
    department: 'Men',
    category: 'Clothing',
    subcategory: 'T-Shirts',
    price: 999,
    originalPrice: 1699,
    rating: 4.8,
    reviewsCount: 84,
    badge: 'BESTSELLER',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#0f172a', '#e2e8f0', '#94a3b8'],
    heroImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: '280 GSM luxury combed cotton with drop-shoulder silhouette',
    description: 'Cut from ultra-dense 280 GSM combed cotton, this heavyweight tee holds its shape effortlessly while delivering breathable all-day drape.',
    styleTip: 'Style with wide-leg trousers or straight denim and clean sneakers.'
  },
  {
    id: 'mf-shirt-01',
    name: 'Metro Relaxed Linen Oxford Shirt',
    audience: 'Men',
    department: 'Men',
    category: 'Clothing',
    subcategory: 'Shirts',
    price: 1699,
    originalPrice: 2799,
    rating: 4.9,
    reviewsCount: 52,
    badge: 'NEW DROP',
    sizes: ['M', 'L', 'XL'],
    colors: ['#f8fafc', '#38bdf8', '#475569'],
    heroImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Pure breathable linen blend with relaxed camp collar',
    description: 'A versatile modern staple. Tailored for warm afternoons and breezy evening layering with reinforced mother-of-pearl buttons.',
    styleTip: 'Wear open over a white tank or buttoned with tailored chinos.'
  },
  {
    id: 'mf-jeans-01',
    name: 'Studio Straight Selvedge Denim',
    audience: 'Men',
    department: 'Men',
    category: 'Clothing',
    subcategory: 'Jeans',
    price: 2299,
    originalPrice: 3499,
    rating: 4.7,
    reviewsCount: 68,
    badge: 'PREMIUM',
    sizes: ['30', '32', '34', '36'],
    colors: ['#1e293b', '#334155'],
    heroImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: '13.5oz authentic ring-spun cotton denim',
    description: 'Classic straight cut featuring clean selvedge lines, copper hardware, and a flattering mid-rise fit.',
    styleTip: 'Cuff the hems once to show the selvedge ID with leather boots.'
  },
  {
    id: 'mf-trousers-01',
    name: 'Atelier Pleated Relaxed Trousers',
    audience: 'Men',
    department: 'Men',
    category: 'Clothing',
    subcategory: 'Trousers',
    price: 1999,
    originalPrice: 3199,
    rating: 4.8,
    reviewsCount: 39,
    badge: 'TRENDING',
    sizes: ['30', '32', '34', '36'],
    colors: ['#334155', '#e2e8f0', '#78350f'],
    heroImage: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Double front pleats with tapered drape',
    description: 'Elevated tailoring that transitions seamlessly from office hours to gallery openings. Subtle stretch ensures all-day comfort.',
    styleTip: 'Tuck in a crisp tee and add a sleek leather belt.'
  },
  {
    id: 'mf-jackets-01',
    name: 'Architectural Minimalist Bomber Jacket',
    audience: 'Men',
    department: 'Men',
    category: 'Clothing',
    subcategory: 'Jackets',
    price: 3299,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 45,
    badge: 'EXCLUSIVE',
    sizes: ['M', 'L', 'XL'],
    colors: ['#0f172a', '#475569'],
    heroImage: 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Matte water-resistant shell with ribbed trims',
    description: 'A sharp outerwear piece featuring clean lines, dual-way YKK zippers, and interior storm pockets for urban utility.',
    styleTip: 'Throw over a monochromatic knitwear base.'
  },
  {
    id: 'mf-ethnic-01',
    name: 'Noor Embroidered Bundi & Kurta Set',
    audience: 'Men',
    department: 'Men',
    category: 'Clothing',
    subcategory: 'Ethnic Wear',
    price: 3999,
    originalPrice: 5999,
    rating: 4.9,
    reviewsCount: 62,
    badge: 'FESTIVE EDIT',
    sizes: ['38', '40', '42', '44'],
    colors: ['#1e1b4b', '#701a75'],
    heroImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Raw silk texture with tonal thread embroidery',
    description: 'Modern occasion-wear blending royal Indian heritage silhouette with sleek contemporary minimalism.',
    styleTip: 'Pair with handcrafted mojaris and a minimalist watch.'
  },
  {
    id: 'mf-shoes-01',
    name: 'Strata Monolith Derby Shoes',
    audience: 'Men',
    department: 'Men',
    category: 'Shoes',
    subcategory: 'Shoes',
    price: 2899,
    originalPrice: 4299,
    rating: 4.7,
    reviewsCount: 31,
    badge: 'STATEMENT',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['#0f172a'],
    heroImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Lugged lightweight sole with burnished vegan leather',
    description: 'A bold, architectural silhouette built with cushioned shock-absorbing footbed for high endurance.',
    styleTip: 'Pairs with both cropped trousers and dark selvedge denim.'
  },
  {
    id: 'mf-acc-01',
    name: 'Saddle Leather Minimal Cardholder',
    audience: 'Men',
    department: 'Men',
    category: 'Accessories',
    subcategory: 'Accessories',
    price: 899,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 94,
    badge: 'EVERYDAY',
    sizes: ['One Size'],
    colors: ['#78350f', '#0f172a'],
    heroImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Top-grain vegetable tanned leather with RFID shielding',
    description: 'Slimline pocket profile carrying up to 8 cards with quick-access front thumb slot.',
    styleTip: 'The perfect compact companion for tailored styling.'
  },

  // WOMEN - CLOTHING
  {
    id: 'wf-dress-01',
    name: 'Elysian Satin Bias-Cut Slip Dress',
    audience: 'Women',
    department: 'Women',
    category: 'Clothing',
    subcategory: 'Dresses',
    price: 2899,
    originalPrice: 4499,
    rating: 4.9,
    reviewsCount: 112,
    badge: 'BESTSELLER',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#831843', '#1e1b4b', '#fdf4ff'],
    heroImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Heavyweight silk-finish viscose with flattering liquid drape',
    description: 'Cut on the bias to gently skim the body, with adjustable delicate straps and subtle side slit for movement.',
    styleTip: 'Layer with an oversized tailored blazer and sculptural earrings.'
  },
  {
    id: 'wf-top-01',
    name: 'Aura Sculpted Asymmetric Knit Top',
    audience: 'Women',
    department: 'Women',
    category: 'Clothing',
    subcategory: 'Tops',
    price: 1399,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 76,
    badge: 'TRENDING',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#d41472', '#0f172a', '#fdf2f8'],
    heroImage: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Fine ribbed organic knit with architectural neckline',
    description: 'A striking statement top featuring an off-centre neckline and ribbed recovery yarns that sculpt comfortably.',
    styleTip: 'Pair with high-waisted palazzo trousers or pencil skirts.'
  },
  {
    id: 'wf-jeans-01',
    name: 'High-Rise Wide Leg Vintage Denim',
    audience: 'Women',
    department: 'Women',
    category: 'Clothing',
    subcategory: 'Jeans',
    price: 2499,
    originalPrice: 3899,
    rating: 4.8,
    reviewsCount: 88,
    badge: 'MUST HAVE',
    sizes: ['26', '28', '30', '32'],
    colors: ['#38bdf8', '#0f172a'],
    heroImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Flattering contoured waistband with relaxed floor-skimming hem',
    description: 'Designed to elongate the frame with structured authentic cotton denim that softens gracefully with wear.',
    styleTip: 'Style with fitted cropped tops and pointed ankle boots.'
  },
  {
    id: 'wf-trousers-01',
    name: 'Palazzo High-Waist Fluid Trousers',
    audience: 'Women',
    department: 'Women',
    category: 'Clothing',
    subcategory: 'Trousers',
    price: 1899,
    originalPrice: 2999,
    rating: 4.7,
    reviewsCount: 47,
    badge: 'NEW ARRIVAL',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#e2e8f0', '#0f172a', '#ea580c'],
    heroImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Lightweight double-crepe weave with deep side pockets',
    description: 'Wide-legged elegance with clean tailored pleats and an elasticated rear waistband for all-day ease.',
    styleTip: 'Tuck in a silk shirt and pair with platform sandals.'
  },
  {
    id: 'wf-kurti-01',
    name: 'Zahra A-Line Chanderi Kurti',
    audience: 'Women',
    department: 'Women',
    category: 'Clothing',
    subcategory: 'Kurtis',
    price: 2199,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 95,
    badge: 'FESTIVE EDIT',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#be185d', '#0f766e'],
    heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Pure Chanderi silk with subtle metallic zari detailing',
    description: 'Breezy flared silhouette adorned with delicate hand-block printed motifs and a mandarin split collar.',
    styleTip: 'Pair with straight pants or flared palazzos and statement jhumkas.'
  },
  {
    id: 'wf-saree-01',
    name: 'Vanya Organza Handloom Saree',
    audience: 'Women',
    department: 'Women',
    category: 'Clothing',
    subcategory: 'Sarees',
    price: 4299,
    originalPrice: 6599,
    rating: 4.9,
    reviewsCount: 63,
    badge: 'HERITAGE',
    sizes: ['Free Size (5.5m + 0.8m blouse)'],
    colors: ['#fda4af', '#fef08a'],
    heroImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Semi-sheer tissue organza with scalloped embroidered border',
    description: 'Feather-light organza drape featuring floral embroidery, complete with an unstitched brocade blouse piece.',
    styleTip: 'Drape with a sleeveless modern blouse and our choker necklace.'
  },
  {
    id: 'wf-shoes-01',
    name: 'Sculpted Block Heel Mules',
    audience: 'Women',
    department: 'Women',
    category: 'Shoes',
    subcategory: 'Shoes',
    price: 2699,
    originalPrice: 3999,
    rating: 4.8,
    reviewsCount: 56,
    badge: 'POPULAR',
    sizes: ['5', '6', '7', '8', '9'],
    colors: ['#d41472', '#fafaf9', '#0f172a'],
    heroImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: '65mm architectural geometric heel with cushioned memory foam insole',
    description: 'Modern slip-on luxury designed for stability and posture with supple vegan leather straps.',
    styleTip: 'Elevate casual denims or pair seamlessly with cocktail dresses.'
  },
  {
    id: 'wf-acc-01',
    name: 'Arc Sculptural Mini Leather Crossbody',
    audience: 'Women',
    department: 'Women',
    category: 'Accessories',
    subcategory: 'Accessories',
    price: 2199,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 71,
    badge: 'NEW ARRIVAL',
    sizes: ['One Size'],
    colors: ['#ea580c', '#0f172a', '#fbcfe8'],
    heroImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Half-moon silhouette with brushed gold hardware',
    description: 'Compact yet roomy interior fits your phone, cardholder, and lipstick with an adjustable shoulder strap.',
    styleTip: 'Wear crossbody over a tailored trench or carry as a clutch.'
  },

  // KIDS
  {
    id: 'kf-cloth-01',
    name: 'Playground Colour-Block Organic Hoodie',
    audience: 'Kids',
    department: 'Kids',
    category: 'Clothing',
    subcategory: 'Clothing',
    price: 999,
    originalPrice: 1599,
    rating: 4.8,
    reviewsCount: 44,
    badge: 'COZY ESSENTIAL',
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: ['#f97316', '#38bdf8', '#a855f7'],
    heroImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: '100% GOTS certified organic brushed fleece',
    description: 'Ultra-soft skin-safe fabric with reinforced double stitching, kangaroo pocket, and stretchy ribbed cuffs.',
    styleTip: 'Pair with jogger pants and everyday trainers for school runs.'
  },
  {
    id: 'kf-cloth-02',
    name: 'Daydream Tiered Cotton Dress',
    audience: 'Kids',
    department: 'Kids',
    category: 'Clothing',
    subcategory: 'Clothing',
    price: 1199,
    originalPrice: 1799,
    rating: 4.9,
    reviewsCount: 38,
    badge: 'NEW ARRIVAL',
    sizes: ['3-4Y', '5-6Y', '7-8Y'],
    colors: ['#f472b6', '#fed7aa'],
    heroImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Breathable printed cotton voile with soft lining',
    description: 'Charming gathered tiers and gentle flutter sleeves made for carefree twirls and sunny playdates.',
    styleTip: 'Add white canvas sneakers and a cute sun hat.'
  },
  {
    id: 'kf-shoes-01',
    name: 'Mini Daylight Grip Slip-On Sneakers',
    audience: 'Kids',
    department: 'Kids',
    category: 'Shoes',
    subcategory: 'Shoes',
    price: 1299,
    originalPrice: 1999,
    rating: 4.7,
    reviewsCount: 29,
    badge: 'ACTIVE PLAY',
    sizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    colors: ['#38bdf8', '#f43f5e'],
    heroImage: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Anti-slip rubber outsole with easy velcro strap',
    description: 'Lightweight, shock-absorbing design that keeps little feet supported through running and climbing.',
    styleTip: 'Great for both sports day and weekend park trips.'
  },
  {
    id: 'kf-acc-01',
    name: 'Explorer Mini Adventure Backpack',
    audience: 'Kids',
    department: 'Kids',
    category: 'Accessories',
    subcategory: 'Accessories',
    price: 799,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 35,
    badge: 'POPULAR',
    sizes: ['One Size'],
    colors: ['#e11d48', '#0284c7'],
    heroImage: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1577741314755-048d8525d31e?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Waterproof nylon with padded ergonomic straps',
    description: 'Designed with dual bottle holders, safety whistle clip, and easy-pull zippers for small hands.',
    styleTip: 'Pack with a water bottle and coloring books.'
  },

  // ACCESSORIES
  {
    id: 'ac-bag-01',
    name: 'Atelier Structured Pebble Leather Tote',
    audience: 'Accessories',
    department: 'Accessories',
    category: 'Bags',
    subcategory: 'Bags',
    price: 2999,
    originalPrice: 4599,
    rating: 4.9,
    reviewsCount: 82,
    badge: 'WORK ESSENTIAL',
    sizes: ['15-inch Laptop Fit'],
    colors: ['#1e293b', '#78350f', '#e2e8f0'],
    heroImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Padded laptop compartment with magnetic zip closure',
    description: 'A timeless silhouette engineered for daily commuting with reinforced handles and interior key leash.',
    styleTip: 'Effortlessly complements sharp suiting or relaxed weekend coats.'
  },
  {
    id: 'ac-shoes-01',
    name: 'Cloudwalk Knit Minimal Runners',
    audience: 'Accessories',
    department: 'Accessories',
    category: 'Shoes',
    subcategory: 'Shoes',
    price: 2499,
    originalPrice: 3799,
    rating: 4.8,
    reviewsCount: 104,
    badge: 'BESTSELLER',
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['#f8fafc', '#0f172a'],
    heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Seamless recycled fly-knit upper with responsive EVA midsole',
    description: 'Weighs under 220g for a barefoot feel that absorbs pavement impact whether you are travelling or running errands.',
    styleTip: 'The ultimate versatile sneaker for athleisure or everyday casuals.'
  },
  {
    id: 'ac-watch-01',
    name: 'Solstice Minimalist Chrono Mesh Watch',
    audience: 'Accessories',
    department: 'Accessories',
    category: 'Watches',
    subcategory: 'Watches',
    price: 2499,
    originalPrice: 3999,
    rating: 4.9,
    reviewsCount: 77,
    badge: 'NEW DROP',
    sizes: ['40mm Dial'],
    colors: ['#0f172a', '#d4af37'],
    heroImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Japanese quartz movement with scratch-proof sapphire crystal',
    description: 'Sleek 7mm ultra-slim case coupled with an adjustable stainless steel Milanese mesh strap.',
    styleTip: 'Adds quiet luxury to any cuff or sleeve.'
  },
  {
    id: 'ac-belt-01',
    name: 'Milano Reversible Fine Leather Belt',
    audience: 'Accessories',
    department: 'Accessories',
    category: 'Belts',
    subcategory: 'Belts',
    price: 1199,
    originalPrice: 1899,
    rating: 4.7,
    reviewsCount: 46,
    badge: 'ESSENTIAL',
    sizes: ['32', '34', '36', '38'],
    colors: ['#0f172a / #78350f'],
    heroImage: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Twist-buckle mechanism with dual black/brown styling',
    description: 'Hand-finished edge burnishing with brushed gunmetal hardware for enduring elegance.',
    styleTip: 'Switch sides seamlessly between black boots and tan loafers.'
  },
  {
    id: 'ac-sunglass-01',
    name: 'Solaris Acetate Polarized Sunglasses',
    audience: 'Accessories',
    department: 'Accessories',
    category: 'Sunglasses',
    subcategory: 'Sunglasses',
    price: 1499,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 63,
    badge: 'TRENDING',
    sizes: ['Medium Fit'],
    colors: ['#0f172a', '#78350f'],
    heroImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'UV400 Category 3 polarized lenses in hand-polished cellulose acetate',
    description: 'Sharp bevelled geometric contours that deliver glare-free vision and unmistakable editorial flair.',
    styleTip: 'The ultimate finishing touch for all-day sunny excursions.'
  },
  {
    id: 'ac-wallet-01',
    name: 'Verona Bifold Zipper Coin Wallet',
    audience: 'Accessories',
    department: 'Accessories',
    category: 'Wallets',
    subcategory: 'Wallets',
    price: 1099,
    originalPrice: 1799,
    rating: 4.8,
    reviewsCount: 51,
    badge: 'CLASSIC',
    sizes: ['Compact'],
    colors: ['#0f172a', '#78350f'],
    heroImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Full-grain leather with 8 card slots and expandable coin pouch',
    description: 'Designed for durability with reinforced nylon stitching and RFID identity theft protection.',
    styleTip: 'Fits neatly into back or inner jacket pockets.'
  },
  {
    id: 'jw-bangles-01',
    name: 'Meera Temple Carved Stacked Bangles',
    audience: 'Jewellery',
    department: 'Jewellery',
    category: 'Jewellery',
    subcategory: 'Bangles',
    price: 1499,
    originalPrice: 2499,
    rating: 4.8,
    reviewsCount: 39,
    badge: 'NEW DROP',
    isAntiTarnish: true,
    sizes: ['2.4', '2.6', '2.8'],
    colors: ['#d4af37'],
    heroImage: 'https://images.unsplash.com/photo-1611591475179-6fe5e79f2dee?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1611591475179-6fe5e79f2dee?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: 'Set of 4 filigree textured brass bangles with nano protective seal',
    description: 'Intricate temple geometry handcrafted by Jaipur artisans, treated with anti-tarnish coating.',
    styleTip: 'Stack with linen kurtis or satin column gowns.'
  },
  {
    id: 'jw-anklets-01',
    name: 'Sitara Celestial Charm Anklet Pair',
    audience: 'Jewellery',
    department: 'Jewellery',
    category: 'Jewellery',
    subcategory: 'Anklets',
    price: 999,
    originalPrice: 1699,
    rating: 4.9,
    reviewsCount: 45,
    badge: 'BESTSELLER',
    isAntiTarnish: true,
    sizes: ['Adjustable Fit'],
    colors: ['#e2e8f0'],
    heroImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    tagline: '925 silver plated delicate link chain with mirror drops',
    description: 'Feather-light ankle jewellery designed with waterproof sealant for everyday beach and festive wear.',
    styleTip: 'Wear with cropped wide-leg trousers or ethnic skirts.'
  }
].map((item) => ({
  ...productDefaults,
  ...item
}));

// Map existing jewellery items ensuring full alignment with TakeFashion design system
const jewelleryProducts = JEWELLERY_DATA.map((product) => {
  let subcategory = 'Earrings';
  if (product.category === 'Necklaces') subcategory = 'Necklaces';
  else if (product.category.includes('Cuff') || product.category.includes('Bracelets')) subcategory = 'Bracelets';
  else if (product.category.includes('Ring')) subcategory = 'Rings';
  else if (product.name.toLowerCase().includes('bangle')) subcategory = 'Bangles';
  else if (product.name.toLowerCase().includes('anklet')) subcategory = 'Anklets';
  else if (product.category.includes('Set')) subcategory = 'Jewellery Sets';

  return {
    ...productDefaults,
    ...product,
    audience: 'Jewellery',
    department: 'Jewellery',
    category: 'Jewellery',
    subcategory
  };
});

// Balanced combined catalog: Fashion dominates, Jewellery is one major department
export const ALL_PRODUCTS = [...fashionCatalogData, ...jewelleryProducts];

export const CATEGORY_CONFIG = {
  men: {
    label: 'Men',
    title: "Men's Collection",
    tagline: 'Modern essentials, sharp tailoring & considered layers',
    description: 'Discover versatile styles crafted from premium fabrics—built to elevate your everyday presence.',
    themeBg: 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#fffafc]',
    heroGradient: 'from-slate-900 via-slate-800 to-indigo-950',
    badgeText: 'MEN / NEW SEASON',
    children: {
      clothing: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Ethnic Wear'],
      shoes: ['Shoes'],
      accessories: ['Accessories']
    }
  },
  women: {
    label: 'Women',
    title: "Women's Collection",
    tagline: 'Fluid silhouettes, modern hues & confident elegance',
    description: 'The curated edit of contemporary dresses, statement tops, versatile denim and timeless ethnic wear.',
    themeBg: 'bg-gradient-to-b from-[#fff5f9] via-[#faf5ff] to-[#fffafc]',
    heroGradient: 'from-fuchsia-950 via-purple-950 to-pink-950',
    badgeText: 'WOMEN / RUNWAY EDIT',
    children: {
      clothing: ['Dresses', 'Tops', 'Jeans', 'Trousers', 'Kurtis', 'Sarees'],
      shoes: ['Shoes'],
      accessories: ['Accessories']
    }
  },
  kids: {
    label: 'Kids',
    title: 'Kids Fashion',
    tagline: 'Playful comfort, durable fabrics & cheerful personalities',
    description: 'Thoughtfully designed clothes, shoes and mini accessories ready for school days and active adventures.',
    themeBg: 'bg-gradient-to-b from-[#fffbf0] via-[#fef7ee] to-[#fffafc]',
    heroGradient: 'from-orange-900 via-amber-900 to-rose-900',
    badgeText: 'KIDS / DAYLIGHT DROPS',
    children: {
      clothing: ['Clothing'],
      shoes: ['Shoes'],
      accessories: ['Accessories']
    }
  },
  jewellery: {
    label: 'Jewellery',
    title: 'Jewellery Atelier',
    tagline: 'Artisanal fusion, modern metals & radiant statements',
    description: 'Explore earrings, necklaces, cuffs and rings engineered with anti-tarnish protective finish.',
    themeBg: 'bg-gradient-to-b from-[#fbf7fe] via-[#fdf4f8] to-[#fffafc]',
    heroGradient: 'from-purple-950 via-rose-950 to-indigo-950',
    badgeText: 'JEWELLERY / STATEMENT EDIT',
    children: {
      jewellery: ['Earrings', 'Necklaces', 'Bracelets', 'Bangles', 'Rings', 'Jewellery Sets', 'Anklets']
    }
  },
  accessories: {
    label: 'Accessories',
    title: 'Accessories & Lifestyle',
    tagline: 'The finishing details that define your total look',
    description: 'Fine leather bags, responsive footwear, polarized eyewear, and minimal chronographs.',
    themeBg: 'bg-gradient-to-b from-[#fafaf9] via-[#f5f5f4] to-[#fffafc]',
    heroGradient: 'from-stone-900 via-neutral-900 to-zinc-900',
    badgeText: 'ACCESSORIES / EDITORIAL CARRY',
    children: {
      accessories: ['Bags', 'Shoes', 'Watches', 'Belts', 'Sunglasses', 'Wallets']
    }
  },
  offers: {
    label: 'Offers',
    title: 'Exclusive Deals & Drops',
    tagline: 'Limited-time fashion edits with up to 50% savings',
    description: 'Upgrade your wardrobe with verified TakeFashion price drops and voucher perks.',
    themeBg: 'bg-gradient-to-b from-[#fdf2f8] via-[#fff7ed] to-[#fffafc]',
    heroGradient: 'from-pink-900 via-fuchsia-900 to-orange-700',
    badgeText: 'OFFERS / SPECIAL PROMOTION',
    children: {
      offers: []
    }
  }
};

export const CATEGORY_PATHS = {
  '/men': ['Men'],
  '/men/clothing': ['Men', 'Clothing'],
  '/men/clothing/t-shirts': ['Men', 'Clothing', 'T-Shirts'],
  '/men/clothing/shirts': ['Men', 'Clothing', 'Shirts'],
  '/men/clothing/jeans': ['Men', 'Clothing', 'Jeans'],
  '/men/clothing/trousers': ['Men', 'Clothing', 'Trousers'],
  '/men/clothing/jackets': ['Men', 'Clothing', 'Jackets'],
  '/men/clothing/ethnic-wear': ['Men', 'Clothing', 'Ethnic Wear'],
  '/men/shoes': ['Men', 'Shoes'],
  '/men/accessories': ['Men', 'Accessories'],

  '/women': ['Women'],
  '/women/clothing': ['Women', 'Clothing'],
  '/women/clothing/dresses': ['Women', 'Clothing', 'Dresses'],
  '/women/clothing/tops': ['Women', 'Clothing', 'Tops'],
  '/women/clothing/jeans': ['Women', 'Clothing', 'Jeans'],
  '/women/clothing/trousers': ['Women', 'Clothing', 'Trousers'],
  '/women/clothing/kurtis': ['Women', 'Clothing', 'Kurtis'],
  '/women/clothing/sarees': ['Women', 'Clothing', 'Sarees'],
  '/women/shoes': ['Women', 'Shoes'],
  '/women/accessories': ['Women', 'Accessories'],

  '/kids': ['Kids'],
  '/kids/clothing': ['Kids', 'Clothing'],
  '/kids/shoes': ['Kids', 'Shoes'],
  '/kids/accessories': ['Kids', 'Accessories'],

  '/jewellery': ['Jewellery'],
  '/jewellery/earrings': ['Jewellery', 'Earrings'],
  '/jewellery/necklaces': ['Jewellery', 'Necklaces'],
  '/jewellery/bracelets': ['Jewellery', 'Bracelets'],
  '/jewellery/bangles': ['Jewellery', 'Bangles'],
  '/jewellery/rings': ['Jewellery', 'Rings'],
  '/jewellery/jewellery-sets': ['Jewellery', 'Jewellery Sets'],
  '/jewellery/anklets': ['Jewellery', 'Anklets'],

  '/accessories': ['Accessories'],
  '/accessories/bags': ['Accessories', 'Bags'],
  '/accessories/shoes': ['Accessories', 'Shoes'],
  '/accessories/watches': ['Accessories', 'Watches'],
  '/accessories/belts': ['Accessories', 'Belts'],
  '/accessories/sunglasses': ['Accessories', 'Sunglasses'],
  '/accessories/wallets': ['Accessories', 'Wallets'],

  '/offers': ['Offers']
};
