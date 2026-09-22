# TakeFashion Backend API and System Overview

Base URL: `http://localhost:3000`

Authentication uses an HTTP-only `takefashion_token` cookie. Run login before protected requests and send requests with credentials enabled.

## Systems and technologies

- Next.js 15 App Router and Route Handlers
- TypeScript
- PostgreSQL database named `takefashion`
- Prisma ORM
- Zod request validation
- JWT authentication using `jose`
- Argon2 password hashing
- Razorpay payment integration
- Environment-based secrets in `.env`
- Postman collection: `postman/TakeFashion_Backend_API.postman_collection.json`

## Public APIs

### Health

- `GET /`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Catalog and products

- `GET /api/products`
  - Supports `search`, `category`, `subcategory`, `min_price`, `max_price`, `size`, `color`, `sort`, `page`, and `limit`.
- `GET /api/products/[productId]`
- `GET /api/products/slug/[slug]`
- `GET /api/products/categories`
- `GET /api/products/featured`
- `GET /api/products/trending`
- `GET /api/products/new-arrivals`
- `GET /api/categories`
- `GET /api/categories/[slug]`
- `GET /api/categories/[slug]/children`

### Offers and coupons

- `GET /api/offers`
- `GET /api/offers/[slug]`
- `POST /api/coupons/validate`

### Authenticated customer APIs

#### Cart

- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/[itemId]`
- `DELETE /api/cart/items/[itemId]`
- `DELETE /api/cart`

#### Wishlist

- `GET /api/wishlist`
- `POST /api/wishlist/items`
- `DELETE /api/wishlist/items/[itemId]`
- `DELETE /api/wishlist`

#### Addresses

- `GET /api/addresses`
- `POST /api/addresses`
- `PATCH /api/addresses/[id]`
- `DELETE /api/addresses/[id]`

#### Orders

- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/[orderId]`
- `PATCH /api/orders/[orderId]/cancel`

#### Payments

- `POST /api/payments/create-order`
- `POST /api/payments/verify`
- `GET /api/payments/order/[orderId]`
- `POST /api/payments/webhook`

## Admin APIs

All `/api/admin/*` routes require an authenticated user with `role = ADMIN`.

### Dashboard and customers

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PATCH /api/admin/users/[id]`

### Product management

- `GET /api/admin/products`
- `POST /api/admin/products`
- `PATCH /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`
- `POST /api/admin/products/[id]/images`
- `POST /api/admin/products/[id]/variants`
- `PATCH /api/admin/inventory/[variantId]`

Product creation supports up to four images, descriptions, brands, prices, merchandising flags, sizes, colors, variant SKUs, and stock quantities.

### Category management

- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/[id]`
- `DELETE /api/admin/categories/[id]`

### Coupon management

- `GET /api/admin/coupons`
- `POST /api/admin/coupons`
- `PATCH /api/admin/coupons/[id]`
- `DELETE /api/admin/coupons/[id]`

### Offer management

- `GET /api/admin/offers`
- `POST /api/admin/offers`
- `PATCH /api/admin/offers/[id]`
- `DELETE /api/admin/offers/[id]`

### Order management

- `GET /api/admin/orders`
- `GET /api/admin/orders/[id]`
- `PATCH /api/admin/orders/[id]`

## Database models

- `User`
- `Category`
- `Product`
- `ProductImage`
- `ProductVariant`
- `Inventory`
- `Cart`
- `CartItem`
- `Wishlist`
- `WishlistItem`
- `Address`
- `Order`
- `OrderItem`
- `Payment`
- `Offer`
- `OfferProduct`
- `OfferCategory`
- `Coupon`

## Important business rules

- Product prices and order totals are calculated on the server.
- Shipping is free when subtotal is at least `999`; otherwise it is `49`.
- Checkout is transactional and clears the cart after successful order creation.
- Stock is checked and deducted during checkout.
- Eligible cancellations restore stock.
- Product name, image, SKU, size, color, and price are stored as order snapshots.
- Customers can access only their own cart, wishlist, addresses, and orders.
- Payment status is finalized only after Razorpay verification.
- Password hashes and payment secrets are never returned to clients.
- Admin deletes deactivate records instead of destroying historical data.

## Run commands

```powershell
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Validation:

```powershell
npm run typecheck
npm run build
```
