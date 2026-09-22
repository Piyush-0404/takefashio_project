# TakeFashion Backend

Backend-only Next.js application for the TakeFashion marketplace. It uses Next.js Route Handlers, Prisma, PostgreSQL, custom JWT cookies, Argon2 password hashing, and Razorpay server-side verification.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` plus a long `JWT_SECRET`.
2. Create the PostgreSQL database named `takefashion`.
3. Install dependencies and generate Prisma Client:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

To create or promote the first administrator, set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env` before running `npm run db:seed`. The password is hashed with Argon2. Log in through `/api/auth/login`; the HTTP-only cookie then authorizes `/api/admin/*` routes.

4. Start the API:

```bash
npm run dev
```

The service runs at `http://localhost:3000`. The root page only reports backend status; the project contains no frontend implementation.

## API groups

- `auth`: register, login, current user, logout
- `products`: listing, search, filters, sorting, pagination, detail, categories, featured
- `cart`: read, add, update, remove, clear
- `wishlist`: read, add, remove, clear
- `orders`: checkout, history, detail, cancellation
- `payments`: Razorpay order creation, signature verification, payment lookup, webhook
- `admin`: protected product, image, variant, inventory, category, coupon, offer, order, customer, and dashboard management

Authenticated routes use the `takefashion_token` HTTP-only cookie. Prices, shipping, stock, ownership, order totals, and payment state are always resolved server-side.

## Business rules implemented

- Shipping is free for subtotal `>= 999`; otherwise it is `49`.
- Checkout is transactional and stores product/address snapshots.
- Stock is deducted during checkout and restored for eligible cancellations.
- Order status and payment status are separate.
- Payment secrets are never returned except for the public Razorpay key ID needed by a client checkout flow.

## Validation

```bash
npm run typecheck
npm run build
```

Both commands currently pass. `db:push` and `db:seed` require a running PostgreSQL server configured by `DATABASE_URL`.

## Admin management APIs

- `GET/POST /api/admin/products`, `PATCH/DELETE /api/admin/products/:id`
- `POST /api/admin/products/:id/images` (replaces up to 4 images)
- `POST /api/admin/products/:id/variants`
- `PATCH /api/admin/inventory/:variantId`
- `GET/POST /api/admin/categories`, `PATCH/DELETE /api/admin/categories/:id`
- `GET/POST /api/admin/coupons`, `PATCH/DELETE /api/admin/coupons/:id`
- `GET/POST /api/admin/offers`, `PATCH/DELETE /api/admin/offers/:id`
- `GET /api/admin/orders`, `GET/PATCH /api/admin/orders/:id`
- `GET /api/admin/users`, `PATCH /api/admin/users/:id`
- `GET /api/admin/dashboard`