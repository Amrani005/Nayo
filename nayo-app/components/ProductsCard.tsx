"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";import Link from "next/link";
import { ShoppingBag, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string | null;
  imageUrl: string;
  images?: string;
  size?: string | null;
}

export default  function ProductsCard({ products }: { products: Product[] }) {

  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const categories = [
    "الكل",
    ...Array.from(new Set(products?.map((p) => p.category).filter(Boolean))),
  ];

  useEffect(() => {
  const match = categoryParam
    ? products.find(
        (product) =>
          product.category.toLowerCase() === categoryParam.toLowerCase()
      )?.category
    : undefined;

  setSelectedCategory(match ?? "الكل");

  if (categoryParam) {
    document.getElementById("products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}, [categoryParam, products]);

  const filteredProducts =
    selectedCategory === "الكل"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (!products || products.length === 0) {
    return (
      <section id="products" data-url-section dir="rtl" className="mx-auto max-w-7xl px-4 py-16 text-center md:px-8">
        <div className="rounded-[28px] border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/60 p-12">
          <p className="text-base font-medium text-stone-500 dark:text-stone-400">
            لا توجد منتجات متوفرة حالياً في المتجر.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" data-url-section dir="rtl" className="w-full px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-10 grid  justify-between gap-6 border-b border-stone-200/80 dark:border-stone-700/80 pb-6 md:flex-row md:items-end"
        >
         
           
            <h2 className=" text-3xl font-bold tracking-tight text-[#141414] dark:text-stone-100 md:text-4xl">
              أحدث الإصدارات
            </h2>
      

          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-stone-100/90 dark:bg-stone-800/90 p-1.5 border border-stone-200/70 dark:border-stone-700/70 self-start md:self-auto">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full px-5 py-2 text-xs sm:text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-[#141414] dark:bg-neutral-800 text-white font-semibold shadow-sm"
                        : "text-stone-600 dark:text-stone-300 font-medium hover:text-[#141414] dark:hover:text-stone-100 hover:bg-white/80 dark:hover:bg-stone-700/80"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => {
            const sizeList = product.size
              ? product.size
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: (index % 4) * 0.12,
                  ease: "easeOut",
                }}
                className="group flex flex-col overflow-hidden rounded-[24px] bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgb(0,0,0,0.08)]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                  <Link href={`/products/${product.id}`} className="block h-full w-full">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>

                  {product.category && (
                    <span className="absolute top-3.5 right-3.5 rounded-full bg-white/90 dark:bg-stone-800/90 px-3.5 py-1 text-[11px] font-semibold text-[#141414] dark:text-stone-100 backdrop-blur-md shadow-sm border border-white/50 dark:border-stone-600/50">
                      {product.category}
                    </span>
                  )}

                  <div className="absolute inset-x-3.5 bottom-3.5 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex w-full items-center justify-between rounded-full bg-white/95 dark:bg-stone-900/95 pl-1.5 pr-4 py-1.5 text-xs font-bold text-[#141414] dark:text-stone-100 shadow-lg backdrop-blur-md transition-transform hover:bg-white dark:hover:bg-stone-700 active:scale-95"
                    >
                      <span>عرض التفاصيل والطلب</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141414] dark:bg-neutral-800 text-white">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="line-clamp-1 text-base font-bold text-[#141414] dark:text-stone-100 transition-colors group-hover:text-[#b48a3e] dark:group-hover:text-[#d4ad65]">
                        {product.name}
                      </h3>
                    </Link>

                    {product.description && (
                      <p className="mt-1 line-clamp-1 text-xs text-stone-500 dark:text-stone-400">
                        {product.description}
                      </p>
                    )}

                    {sizeList.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1">
                        <span className="text-[11px] text-stone-400 dark:text-stone-400 ml-1">المقاسات:</span>
                        {sizeList.map((sz, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-semibold text-stone-700 dark:text-stone-200 border border-stone-200/70 dark:border-stone-700/70"
                          >
                            {sz}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-[#141414] dark:text-stone-100">
                        {Number(product.price).toLocaleString("ar-DZ")}
                      </span>
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        د.ج
                      </span>
                    </div>

                    <Link
                      href={`/productPage/${product.id}`}
                      aria-label={`شراء ${product.name}`}
                      className="flex h-9 w-9 items-center 
                      justify-center rounded-full 
                       text-[#141414] dark:text-stone-100
                        transition-colors hover:bg-[#141414] dark:hover:bg-neutral-700
                         hover:text-white"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
