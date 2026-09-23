import { db } from "@/lib/db";

export async function createNotification(userId: string, data: { type: string; title: string; message: string; link?: string | null }) {
  return db.notification.create({ data: { userId, ...data } });
}

export async function createNotificationsForUsers(userIds: string[], data: { type: string; title: string; message: string; link?: string | null }) {
  if (!userIds.length) return { count: 0 };
  return db.notification.createMany({ data: userIds.map((userId) => ({ userId, ...data })) });
}