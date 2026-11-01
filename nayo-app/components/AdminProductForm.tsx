"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, LoaderCircle, Save } from "lucide-react";
import { createProducts } from "@/actions/createProducts";
import { updateProducts } from "@/actions/updateProducts";

type ProductFormValue = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price: number;
  size: string;
  imageUrl: string;
  images: string;
};

const sizes = ["S", "M", "L", "XL", "XXL"];
const categories = [
  { value: "Abayas", label: "عبايات" },
  { value: "Gandouras", label: "قنادر" },
  { value: "Accessories", label: "إكسسوارات" },
  { value: "Uncategorized", label: "غير مصنف" },
];

function readSizes(value?: string) {
  try {
    const parsed: unknown = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function AdminProductForm({ product }: { product?: ProductFormValue }) {
  const router = useRouter();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(readSizes(product?.size));
  const [imagePreview, setImagePreview] = useState(product?.imageUrl ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const imageInput = form.elements.namedItem("imageUrl") as HTMLInputElement;
    if (!product && !imageInput.files?.[0]) {
      setError("يرجى اختيار صورة رئيسية للمنتج قبل الحفظ.");
      return;
    }
    if (selectedSizes.length === 0) {
      setError("يرجى اختيار مقاس واحد متاح على الأقل.");
      return;
    }

    const data = new FormData(form);
    data.set("size", JSON.stringify(selectedSizes));
    if (product) data.set("id", product.id);

    setIsSubmitting(true);
    try {
      const result = product ? await updateProducts(data) : await createProducts(data);
      if (!result?.success) {
        setError("تعذر حفظ المنتج. تحققي من البيانات وحاولي مرة أخرى.");
        return;
      }

      router.push("/admin-panel/products");
      router.refresh();
    } catch (submitError) {
      console.error("Failed to save product:", submitError);
      setError("حدث خطأ غير متوقع أثناء حفظ المنتج.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-10 flex flex-col gap-6 border-b border-stone-200/80 dark:border-stone-700/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">إدارة متجر نايو</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-4xl">
            {product ? "تعديل المنتج" : "إضافة منتج"}
          </h1>
          <p className="mt-2.5 text-sm font-medium text-stone-500 dark:text-stone-400">
            {product ? "حدّثي تفاصيل المنتج في المتجر." : "أضيفي منتجًا جديدًا إلى المتجر."}
          </p>
        </div>
        <Link
          href="/admin-panel/products"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 px-6 py-3.5 text-xs font-bold text-[#141414] dark:text-stone-100 transition-colors hover:border-[#b48a3e]"
        >
          <ArrowLeft className="h-4 w-4 rotate-180 text-[#b48a3e] dark:text-[#d4ad65]" />
          العودة إلى المنتجات
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <section className="flex flex-col gap-7 rounded-[24px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:p-8">
          <label className="flex flex-col gap-2 text-sm font-bold text-stone-500 dark:text-stone-400">
            اسم المنتج
            <input
              name="name"
              required
              maxLength={120}
              defaultValue={product?.name}
              className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 px-4 py-3 text-base font-medium text-[#141414] dark:text-stone-100 outline-none transition-colors focus:border-[#b48a3e]"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-bold text-stone-500 dark:text-stone-400">
            الفئة
            <select
              name="category"
              defaultValue={product?.category ?? "Abayas"}
              className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 px-4 py-3 text-base font-medium text-[#141414] dark:text-stone-100 outline-none transition-colors focus:border-[#b48a3e]"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
              {product?.category && !categories.some(({ value }) => value === product.category) && (
                <option value={product.category}>{product.category}</option>
              )}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-bold text-stone-500 dark:text-stone-400">
            السعر (دج)
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={product?.price}
              className="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 px-4 py-3 text-base font-medium text-[#141414] dark:text-stone-100 outline-none transition-colors focus:border-[#b48a3e]"
            />
          </label>

          <fieldset>
            <legend className="mb-4 text-sm font-bold text-stone-500 dark:text-stone-400">
              المقاسات المتاحة
            </legend>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => {
                const checked = selectedSizes.includes(size);
                return (
                  <label key={size} className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelectedSizes((current) =>
                          checked ? current.filter((value) => value !== size) : [...current, size],
                        )
                      }
                      className="sr-only"
                    />
                    <span
                      className={`flex h-12 w-12 items-center justify-center border text-sm font-medium transition-colors ${
                        checked ? "border-[#141414] dark:border-stone-300 bg-[#141414] dark:bg-neutral-800 text-white" : "border-stone-200 dark:border-stone-700 text-[#141414] dark:text-stone-100 hover:border-[#b48a3e]"
                      }`}
                    >
                      {size}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="flex flex-col gap-2 text-sm font-bold text-stone-500 dark:text-stone-400">
            الوصف
            <textarea
              name="description"
              rows={6}
              defaultValue={product?.description ?? ""}
              className="resize-y rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50 px-4 py-3 text-base font-medium text-[#141414] dark:text-stone-100 outline-none transition-colors focus:border-[#b48a3e]"
            />
          </label>
        </section>

        <aside className="flex flex-col gap-6 rounded-[24px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:p-8">
          <div>
            <h2 className="mb-3 text-sm font-bold text-stone-500 dark:text-stone-400">
              الصورة الرئيسية للمنتج
            </h2>
            <label className="relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-stone-300 dark:border-stone-600 bg-stone-50/50 dark:bg-stone-900/50 transition-colors hover:border-[#b48a3e]">
              <input
                type="file"
                name="imageUrl"
                accept="image/*"
                required={!product}
                onChange={handleImageChange}
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
              />
              {imagePreview ? (
                <div
                  role="img"
                  aria-label="معاينة صورة المنتج"
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${imagePreview}")` }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-stone-400 dark:text-stone-400">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-xs font-bold">اختاري صورة</span>
                </div>
              )}
            </label>
            {product && (
              <p className="mt-2 text-xs font-medium text-stone-500 dark:text-stone-400">اتركي الحقل فارغًا للاحتفاظ بالصورة الحالية.</p>
            )}
          </div>

          <input type="hidden" name="images" value={product?.images ?? "[]"} />

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/50 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-auto inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#141414] dark:bg-neutral-800 px-5 py-4 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-neutral-400"
          >
            {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />}
            {isSubmitting ? "جارٍ الحفظ..." : product ? "حفظ التعديلات" : "إنشاء المنتج"}
          </button>
        </aside>
      </form>
    </main>
  );
}
