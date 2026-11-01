"use server";

import { db } from "@/lib/db";
import { revalidatePath, updateTag } from "next/cache";
import { STOREFRONT_PRODUCTS_CACHE_TAG } from "@/lib/cache-tags";
import { requireOwner } from "@/lib/owner-auth";

export async function deleteProducts(formData: FormData) {
  await requireOwner();

  const productId = formData.get("id");
  if (typeof productId !== "string" || !productId) {
    throw new Error("A product ID is required.");
  }

  await db.product.delete({ where: { id: productId } });
  updateTag(STOREFRONT_PRODUCTS_CACHE_TAG);
  revalidatePath("/admin-panel");
  revalidatePath("/admin-panel/products");
  revalidatePath("/");
}
