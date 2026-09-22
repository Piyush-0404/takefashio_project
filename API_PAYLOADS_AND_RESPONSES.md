# TakeFashion API Payloads and Response Examples

Base URL:

```text
http://localhost:3000
```

Authentication uses the HTTP-only `takefashion_token` cookie. Login first, then send the cookie with protected requests.

## 1. Health

### `GET /`

Payload: none.

Response:

```json
{
  "message": "TakeFashion backend is running"
}
```

## 2. Authentication

### `POST /api/auth/register`

Payload:

```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "password": "Password123!"
}
```

Response `201`:

```json
{
  "user": {
    "id": "user_id",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "role": "CUSTOMER",
    "createdAt": "2026-09-22T10:00:00.000Z"
  }
}
```

### `POST /api/auth/login`

Payload:

```json
{
  "email": "aarav@example.com",
  "password": "Password123!"
}
```

Response `200`:

```json
{
  "user": {
    "id": "user_id",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "role": "CUSTOMER"
  }
}
```

The response also sets the `takefashion_token` cookie.

### `GET /api/auth/me`

Payload: none.

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "role": "CUSTOMER"
  }
}
```

### `POST /api/auth/logout`

Payload: none.

Response:

```json
{
  "message": "Logged out"
}
```

## 3. Products and Categories

### `GET /api/products`

Example URL:

```text
/api/products?search=shirt&category=men&min_price=500&max_price=3000&size=M&color=Black&sort=price_asc&page=1&limit=20
```

Payload: none.

Response:

```json
{
  "products": [
    {
      "id": "product_id",
      "name": "Linen Relaxed Shirt",
      "slug": "linen-relaxed-shirt",
      "description": "Breathable everyday linen shirt.",
      "price": "1499",
      "stock": 25,
      "isFeatured": true,
      "category": {
        "id": "category_id",
        "name": "Men",
        "slug": "men"
      },
      "productImages": [],
      "variants": []
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

### Product detail endpoints

Endpoints:

```text
GET /api/products/[productId]
GET /api/products/slug/[slug]
```

Payload: none.

Response:

```json
{
  "product": {
    "id": "product_id",
    "name": "Linen Relaxed Shirt",
    "slug": "linen-relaxed-shirt",
    "description": "Breathable everyday linen shirt.",
    "brand": "TakeFashion",
    "price": "1499",
    "category": { "id": "category_id", "name": "Men", "slug": "men" },
    "productImages": [
      {
        "id": "image_id",
        "imageUrl": "https://cdn.example.com/shirt-front.jpg",
        "altText": "Front view"
      }
    ],
    "variants": [
      {
        "id": "variant_id",
        "sku": "SHIRT-M-BLACK",
        "size": "M",
        "color": "Black",
        "price": "1499",
        "stockQuantity": 10
      }
    ]
  }
}
```

### `GET /api/products/categories`

Payload: none.

Response:

```json
{
  "categories": [
    { "id": "category_id", "name": "Men", "slug": "men" }
  ]
}
```

### `GET /api/products/featured`

### `GET /api/products/trending`

### `GET /api/products/new-arrivals`

Payload: none.

Response shape:

```json
{
  "products": [
    { "id": "product_id", "name": "Featured Product", "price": "1499" }
  ]
}
```

### Category endpoints

Endpoints:

```text
GET /api/categories
GET /api/categories/[slug]
GET /api/categories/[slug]/children
```

Payload: none.

Response example:

```json
{
  "categories": [
    {
      "id": "category_id",
      "name": "Women",
      "slug": "women",
      "children": [
        { "id": "child_id", "name": "Dresses", "slug": "women-dresses" }
      ]
    }
  ]
}
```

## 4. Cart

All cart endpoints require login.

### `GET /api/cart`

Payload: none.

Response:

```json
{
  "cart": {
    "id": "cart_id",
    "items": [
      {
        "id": "cart_item_id",
        "quantity": 2,
        "product": {
          "id": "product_id",
          "name": "Linen Relaxed Shirt",
          "price": "1499"
        }
      }
    ]
  }
}
```

### `POST /api/cart/items`

Payload:

```json
{
  "productId": "product_id",
  "quantity": 2
}
```

Response `201`:

```json
{
  "item": {
    "id": "cart_item_id",
    "productId": "product_id",
    "quantity": 2
  }
}
```

### `PATCH /api/cart/items/[itemId]`

Payload:

```json
{
  "quantity": 3
}
```

Response:

```json
{
  "item": {
    "id": "cart_item_id",
    "quantity": 3
  }
}
```

### `DELETE /api/cart/items/[itemId]`

### `DELETE /api/cart`

Payload: none.

Response:

```json
{
  "message": "Item removed"
}
```

## 5. Wishlist

### `GET /api/wishlist`

Payload: none.

Response:

```json
{
  "items": [
    {
      "id": "wishlist_item_id",
      "product": { "id": "product_id", "name": "Linen Relaxed Shirt" }
    }
  ]
}
```

### `POST /api/wishlist/items`

Payload:

```json
{
  "productId": "product_id"
}
```

Response `201`:

```json
{
  "item": {
    "id": "wishlist_item_id",
    "productId": "product_id"
  }
}
```

### `DELETE /api/wishlist/items/[itemId]`

### `DELETE /api/wishlist`

Payload: none.

Response:

```json
{
  "message": "Item removed"
}
```

## 6. Addresses

### `GET /api/addresses`

Payload: none.

Response:

```json
{
  "addresses": [
    {
      "id": "address_id",
      "fullName": "Aarav Sharma",
      "phone": "9876543210",
      "addressLine1": "10 Fashion Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ]
}
```

### `POST /api/addresses`

Payload:

```json
{
  "fullName": "Aarav Sharma",
  "phone": "9876543210",
  "addressLine1": "10 Fashion Street",
  "addressLine2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India",
  "isDefault": true
}
```

Response `201`:

```json
{
  "address": {
    "id": "address_id",
    "fullName": "Aarav Sharma",
    "isDefault": true
  }
}
```

### `PATCH /api/addresses/[id]`

Payload:

```json
{
  "phone": "9999999999",
  "isDefault": true
}
```

Response:

```json
{
  "address": { "id": "address_id", "phone": "9999999999" }
}
```

### `DELETE /api/addresses/[id]`

Payload: none.

Response:

```json
{
  "message": "Address deleted"
}
```

## 7. Orders and Checkout

### `POST /api/orders`

Payload:

```json
{
  "shippingAddress": {
    "name": "Aarav Sharma",
    "phone": "9876543210",
    "line1": "10 Fashion Street",
    "line2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  }
}
```

Response `201`:

```json
{
  "order": {
    "id": "order_id",
    "orderNumber": "order_number",
    "status": "PENDING",
    "paymentStatus": "CREATED",
    "subtotal": "1499",
    "shippingFee": "0",
    "total": "1499",
    "items": [
      {
        "productName": "Linen Relaxed Shirt",
        "quantity": 1,
        "unitPrice": "1499"
      }
    ]
  }
}
```

Shipping is free for subtotal `>= 999`; otherwise it is `49`.

### `GET /api/orders`

### `GET /api/orders/[orderId]`

Payload: none.

Response shape:

```json
{
  "orders": [
    {
      "id": "order_id",
      "orderNumber": "order_number",
      "status": "CONFIRMED",
      "paymentStatus": "SUCCESS",
      "total": "1499"
    }
  ]
}
```

The detail endpoint returns one `order` instead of `orders`.

### `PATCH /api/orders/[orderId]/cancel`

Payload: none.

Response:

```json
{
  "order": {
    "id": "order_id",
    "status": "CANCELLED"
  }
}
```

## 8. Coupons and Offers

### `POST /api/coupons/validate`

Payload:

```json
{
  "code": "WELCOME10",
  "subtotal": 1500
}
```

Response:

```json
{
  "valid": true,
  "code": "WELCOME10",
  "discount": 150
}
```

### `GET /api/offers`

### `GET /api/offers/[slug]`

Payload: none.

Response:

```json
{
  "offers": [
    {
      "id": "offer_id",
      "name": "Summer Sale",
      "slug": "summer-sale",
      "offerType": "PERCENTAGE",
      "percentage": "20"
    }
  ]
}
```

The slug endpoint returns one `offer` instead of `offers`.

## 9. Payments

### `POST /api/payments/create-order`

Payload:

```json
{
  "orderId": "order_id"
}
```

Response:

```json
{
  "paymentOrder": {
    "id": "razorpay_order_id",
    "amount": 149900,
    "currency": "INR",
    "keyId": "rzp_test_public_key"
  }
}
```

### `POST /api/payments/verify`

Payload:

```json
{
  "razorpay_order_id": "razorpay_order_id",
  "razorpay_payment_id": "razorpay_payment_id",
  "razorpay_signature": "razorpay_signature"
}
```

Response:

```json
{
  "verified": true,
  "order": {
    "id": "order_id",
    "status": "CONFIRMED",
    "paymentStatus": "CAPTURED"
  }
}
```

### `GET /api/payments/order/[orderId]`

Payload: none.

Response:

```json
{
  "payment": {
    "provider": "razorpay",
    "providerOrderId": "razorpay_order_id",
    "status": "CAPTURED",
    "amount": "1499",
    "currency": "INR"
  }
}
```

### `POST /api/payments/webhook`

Headers:

```text
x-razorpay-signature: verified_webhook_signature
Content-Type: application/json
```

Payload example:

```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "razorpay_payment_id",
        "order_id": "razorpay_order_id"
      }
    }
  }
}
```

Response:

```json
{
  "received": true
}
```

## 10. Admin APIs

All admin APIs require an authenticated user with `role = ADMIN`.

### Admin login

Use the normal endpoint:

```text
POST /api/auth/login
```

Payload:

```json
{
  "email": "admin@example.com",
  "password": "AdminPassword123!"
}
```

### Admin dashboard

#### `GET /api/admin/dashboard`

Payload: none.

Response:

```json
{
  "metrics": {
    "products": 20,
    "categories": 25,
    "customers": 120,
    "orders": 85,
    "revenue": "125000.00"
  }
}
```

### Admin products

Endpoints:

```text
GET    /api/admin/products
POST   /api/admin/products
PATCH  /api/admin/products/[id]
DELETE /api/admin/products/[id]
```

Create product payload:

```json
{
  "name": "Premium Black Jacket",
  "slug": "premium-black-jacket",
  "description": "Water-resistant jacket with premium lining.",
  "brand": "TakeFashion",
  "categoryId": "category_id",
  "sku": "JACKET-BLACK",
  "gender": "UNISEX",
  "price": 2499,
  "basePrice": 2999,
  "salePrice": 2499,
  "stock": 30,
  "isFeatured": true,
  "isNewArrival": true,
  "isTrending": false,
  "images": [
    { "imageUrl": "https://cdn.example.com/front.jpg", "altText": "Front", "isPrimary": true, "sortOrder": 0 },
    { "imageUrl": "https://cdn.example.com/back.jpg", "altText": "Back", "sortOrder": 1 },
    { "imageUrl": "https://cdn.example.com/side.jpg", "altText": "Side", "sortOrder": 2 },
    { "imageUrl": "https://cdn.example.com/detail.jpg", "altText": "Detail", "sortOrder": 3 }
  ],
  "variants": [
    { "sku": "JACKET-M-BLACK", "size": "M", "color": "Black", "price": 2499, "stockQuantity": 15 },
    { "sku": "JACKET-L-BLACK", "size": "L", "color": "Black", "price": 2499, "stockQuantity": 15 }
  ]
}
```

Response `201`:

```json
{
  "product": {
    "id": "product_id",
    "name": "Premium Black Jacket",
    "productImages": [
      { "imageUrl": "https://cdn.example.com/front.jpg" }
    ],
    "variants": [
      { "sku": "JACKET-M-BLACK", "size": "M", "color": "Black" }
    ]
  }
}
```

### Admin product images

#### `POST /api/admin/products/[id]/images`

This replaces the product image list. Send 1 to 4 images.

Payload:

```json
[
  { "imageUrl": "https://cdn.example.com/front.jpg", "altText": "Front", "isPrimary": true, "sortOrder": 0 },
  { "imageUrl": "https://cdn.example.com/back.jpg", "altText": "Back", "sortOrder": 1 }
]
```

Response:

```json
{
  "images": [
    { "id": "image_id", "productId": "product_id", "imageUrl": "https://cdn.example.com/front.jpg" }
  ]
}
```

### Admin variants and inventory

#### `POST /api/admin/products/[id]/variants`

Payload:

```json
{
  "sku": "JACKET-XL-BLACK",
  "size": "XL",
  "color": "Black",
  "price": 2499,
  "stockQuantity": 10
}
```

Response:

```json
{
  "variant": {
    "id": "variant_id",
    "sku": "JACKET-XL-BLACK",
    "inventory": {
      "quantity": 10,
      "reservedQuantity": 0,
      "availableQuantity": 10
    }
  }
}
```

#### `PATCH /api/admin/inventory/[variantId]`

Payload:

```json
{
  "quantity": 50,
  "reservedQuantity": 5
}
```

Response:

```json
{
  "inventory": {
    "quantity": 50,
    "reservedQuantity": 5,
    "availableQuantity": 45
  }
}
```

### Admin categories

Endpoints:

```text
GET    /api/admin/categories
POST   /api/admin/categories
PATCH  /api/admin/categories/[id]
DELETE /api/admin/categories/[id]
```

Create category payload:

```json
{
  "name": "Dresses",
  "slug": "women-dresses",
  "parentId": "women_category_id",
  "description": "Women's dresses",
  "sortOrder": 1,
  "isActive": true
}
```

Response:

```json
{
  "category": {
    "id": "category_id",
    "name": "Dresses",
    "slug": "women-dresses",
    "parentId": "women_category_id"
  }
}
```

### Admin coupons

Endpoints:

```text
GET    /api/admin/coupons
POST   /api/admin/coupons
PATCH  /api/admin/coupons/[id]
DELETE /api/admin/coupons/[id]
```

Create coupon payload:

```json
{
  "code": "WELCOME10",
  "description": "Welcome discount",
  "type": "PERCENTAGE",
  "value": 10,
  "minimumAmount": 500,
  "maximumDiscount": 500,
  "usageLimit": 100,
  "startsAt": "2026-09-22T00:00:00.000Z",
  "endsAt": "2027-09-22T23:59:59.000Z",
  "isActive": true
}
```

Response:

```json
{
  "coupon": {
    "id": "coupon_id",
    "code": "WELCOME10",
    "type": "PERCENTAGE",
    "value": "10"
  }
}
```

### Admin offers

Endpoints:

```text
GET    /api/admin/offers
POST   /api/admin/offers
PATCH  /api/admin/offers/[id]
DELETE /api/admin/offers/[id]
```

Create offer payload:

```json
{
  "name": "Summer Sale",
  "slug": "summer-sale",
  "description": "Seasonal discount",
  "offerType": "PERCENTAGE",
  "percentage": 20,
  "minimumOrderAmount": 1000,
  "maximumDiscount": 1000,
  "startsAt": "2026-09-22T00:00:00.000Z",
  "endsAt": "2027-09-22T23:59:59.000Z",
  "productIds": ["product_id"],
  "categoryIds": ["category_id"],
  "isActive": true
}
```

Response:

```json
{
  "offer": {
    "id": "offer_id",
    "name": "Summer Sale",
    "offerType": "PERCENTAGE",
    "products": [{ "productId": "product_id" }],
    "categories": [{ "categoryId": "category_id" }]
  }
}
```

### Admin orders

Endpoints:

```text
GET   /api/admin/orders
GET   /api/admin/orders/[id]
PATCH /api/admin/orders/[id]
```

Update order payload:

```json
{
  "status": "PROCESSING",
  "paymentStatus": "SUCCESS"
}
```

Response:

```json
{
  "order": {
    "id": "order_id",
    "status": "PROCESSING",
    "paymentStatus": "SUCCESS"
  }
}
```

### Admin users

#### `GET /api/admin/users`

Payload: none.

Response:

```json
{
  "users": [
    {
      "id": "user_id",
      "name": "Aarav Sharma",
      "email": "aarav@example.com",
      "role": "CUSTOMER",
      "isActive": true,
      "_count": { "orders": 2 }
    }
  ]
}
```

#### `PATCH /api/admin/users/[id]`

Payload:

```json
{
  "name": "Aarav Sharma",
  "role": "CUSTOMER",
  "isActive": true
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "name": "Aarav Sharma",
    "role": "CUSTOMER",
    "isActive": true
  }
}
```

## Common errors

Unauthenticated:

```json
{
  "error": "Authentication required"
}
```

Forbidden admin access:

```json
{
  "error": "Admin access required"
}
```

Validation error:

```json
{
  "error": "Validation failed",
  "details": {}
}
```

Not found:

```json
{
  "error": "Product not found"
}
```
