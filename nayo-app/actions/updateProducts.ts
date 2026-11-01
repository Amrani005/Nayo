"use server";

import { Buffer } from "buffer";
import { revalidatePath, updateTag } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { db } from "@/lib/db";
import { STOREFRONT_PRODUCTS_CACHE_TAG } from "@/lib/cache-tags";
import { requireOwner } from "@/lib/owner-auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateProducts(formData: FormData) {
  await requireOwner();

  const id = formData.get("id");
  const name = formData.get("name");
  const category = formData.get("category");
  const description = formData.get("description");
  const price = Number(formData.get("price"));
  const image = formData.get("imageUrl");
  const size = formData.get("size");
  const images = formData.get("images");

  if (
    typeof id !== "string" ||
    !id ||
    typeof name !== "string" ||
    !name.trim() ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return { success: false };
  }

  try {
    let newImageUrl: string | undefined;
    if (image instanceof File && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      newImageUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "products" }, (error, result) => {
            if (error) {
              reject(error);
            } else if (result?.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(new Error("Cloudinary did not return an image URL."));
            }
          })
          .end(buffer);
      });
    }

    await db.product.update({
      where: { id },
      data: {
        name: name.trim(),
        category: typeof category === "string" && category ? category : "Uncategorized",
        price,
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
        images: typeof images === "string" ? images : "[]",
        size: typeof size === "string" ? size : "[]",
      },
    });

    updateTag(STOREFRONT_PRODUCTS_CACHE_TAG);
    revalidatePath("/admin-panel");
    revalidatePath("/admin-panel/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false };
  }
}
