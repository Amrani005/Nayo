"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { orderStatuses } from "@/constants";
import { requireOwner } from "@/lib/owner-auth";

export async function updateOrderStatus(formData: FormData) {
  await requireOwner();

  const id = formData.get("id");
  const status = formData.get("status");

  if (
    typeof id !== "string" ||
    !id ||
    typeof status !== "string" ||
    !Object.keys(orderStatuses).includes(status)
  ) {
    throw new Error("Invalid order status update.");
  }

  await db.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin-panel");
  revalidatePath("/admin-panel/orders");
  revalidatePath("/admin-panel/draft");
}
