import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Package, Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { deleteProducts } from "@/actions/deleteProducts";

const categoryLabels: Record<string, string> = {
  Abayas: "عبايات",
  Gandouras: "قنادر",
  Accessories: "إكسسوارات",
  Uncategorized: "غير مصنف",
};

export default function ProductsPage() {
  return (
    <main id="admin-products" data-url-section dir="rtl" className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-10 flex flex-col gap-6 border-b border-stone-200/80 dark:border-stone-700/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">إدارة متجر نايو</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-4xl">المنتجات</h1>
          <p className="mt-2.5 text-sm font-medium text-stone-500 dark:text-stone-400">
            أديري مجموعة المنتجات وتفاصيلها.
          </p>
        </div>
        <Link
          href="/admin-panel/products/add"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#141414] dark:bg-neutral-800 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95"
        >
          <Plus className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />
          إضافة منتج
        </Link>
      </div>
      <Suspense fallback={<p className="py-16 text-sm font-medium text-stone-500 dark:text-stone-400">جارٍ تحميل المنتجات...</p>}>
        <ProductsTable />
      </Suspense>
    </main>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div id="product-list" data-url-section className="overflow-hidden rounded-[24px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-right">
          <thead>
            <tr>
              <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">المنتج</th>
              <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">الفئة</th>
              <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">السعر</th>
              <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">تاريخ الإضافة</th>
              <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {products.length ? (
              products.map((product: any) => (
                <tr key={product.id} className="text-sm transition-colors hover:bg-stone-50/60 dark:hover:bg-stone-800/60">
                  <td className="px-6 py-5 font-bold text-[#141414] dark:text-stone-100">{product.name}</td>
                  <td className="px-6 py-5 text-sm font-medium text-stone-500 dark:text-stone-400">{categoryLabels[product.category] ?? product.category}</td>
                  <td className="px-6 py-5 font-bold text-[#141414] dark:text-stone-100">
                    {new Intl.NumberFormat("ar-DZ").format(product.price)} <span className="text-xs font-medium text-stone-500 dark:text-stone-400">دج</span>
                  </td>
                  <td className="px-6 py-5 text-xs font-medium text-stone-500 dark:text-stone-400">
                    {new Intl.DateTimeFormat("ar-DZ", { dateStyle: "medium" }).format(product.createdAt)}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin-panel/products/${product.id}/edit`}
                        aria-label={`تعديل ${product.name}`}
                        className="text-stone-400 dark:text-stone-400 transition-colors hover:text-[#b48a3e] dark:hover:text-[#d4ad65]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <form action={deleteProducts}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          aria-label={`حذف ${product.name}`}
                          className="text-stone-400 dark:text-stone-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center">
                  <Package className="mx-auto mb-4 h-8 w-8 text-stone-300 dark:text-stone-500" />
                  <p className="font-bold text-[#141414] dark:text-stone-100">قائمة المنتجات فارغة</p>
                  <p className="mt-2 text-sm font-medium text-stone-500 dark:text-stone-400">أضيفي منتجًا للبدء.</p>
                  <Link
                    href="/admin-panel/products/add"
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65] transition-colors hover:text-[#141414] dark:hover:text-stone-100"
                  >
                    <ArrowRight className="h-3 w-3 rotate-180" />
                    أضيفي أول منتج
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
