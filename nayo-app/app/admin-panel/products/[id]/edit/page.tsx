import { Suspense } from "react";
import { notFound } from "next/navigation";
import AdminProductForm from "@/components/AdminProductForm";
import { db } from "@/lib/db";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-[90rem] px-4 py-16 text-sm font-medium text-stone-500">جارٍ تحميل المنتج...</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) notFound();

  return (
    <AdminProductForm
      product={{
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        price: product.price,
        size: product.size,
        imageUrl: product.imageUrl,
        images: product.images,
      }}
    />
  );
}
