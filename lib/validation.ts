import { z } from "zod";

export const registerSchema = z.object({ name: z.string().trim().min(2).max(80), email: z.email(), password: z.string().min(8).max(128) });
export const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });
export const cartItemSchema = z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(99) });
export const quantitySchema = z.object({ quantity: z.number().int().min(1).max(99) });
export const addressSchema = z.object({ name: z.string().min(2), phone: z.string().min(7), line1: z.string().min(3), line2: z.string().optional(), city: z.string().min(2), state: z.string().min(2), postalCode: z.string().min(3), country: z.string().default("India") });