"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/owner-auth";

export async function deleteOrders(formData: FormData) {
  await requireOwner();

  const orderId = formData.get("id");
  if (typeof orderId !== "string" || !orderId) {
    throw new Error("An order ID is required.");
  }

  await db.order.delete({ where: { id: orderId } });
  revalidatePath("/admin-panel");
  revalidatePath("/admin-panel/orders");
  revalidatePath("/admin-panel/draft");
  revalidatePath("/");
}
