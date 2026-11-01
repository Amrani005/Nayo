'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};


type CategoryProps = {
  products: RelatedProduct[];
  hasMore: boolean;
  isLoadingMore: boolean;
  hasError: boolean;
  onLoadMore: () => Promise<void>;
};

export default function Category({
  products,
  hasMore,
  isLoadingMore,
  hasError,
  onLoadMore,
}: CategoryProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.scrollBy({
      left: direction * slider.offsetWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section id="related-products" data-url-section className="w-full bg-white dark:bg-stone-900 text-black dark:text-neutral-100 py-16 md:py-24 px-4 md:px-8 border-t border-neutral-200 dark:border-neutral-700">
      <div className="max-w-[100rem] mx-auto">
        <div className="flex items-end justify-between border-b border-neutral-200 dark:border-neutral-700 pb-8 mb-10">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter uppercase">
            قد يعجبك أيضاً
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="المنتجات السابقة"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="المنتجات التالية"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-600 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          dir="ltr"
          onScroll={(event) => {
            const slider = event.currentTarget;
            const nearEnd =
              slider.scrollWidth - slider.clientWidth - slider.scrollLeft <
              slider.clientWidth * 0.5;

            if (nearEnd && hasMore && !isLoadingMore) {
              void onLoadMore();
            }
          }}
          className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              dir="rtl"
              className="snap-start flex-shrink-0 w-[calc(100%/2.5)] md:w-[calc((100%-6rem)/4)]"
            >
              <Link href={`/products/${product.id}`} className="group flex flex-col cursor-pointer">
                <div className="relative w-full aspect-[3/4] bg-[#f4f4f5] dark:bg-neutral-800 overflow-hidden mb-4 rounded-sm">
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    loading={index < 4 ? "eager" : "lazy"}
                    decoding="async"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="text-sm font-bold tracking-wide uppercase text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-sm font-mono font-medium text-black dark:text-neutral-100 whitespace-nowrap">
                    DA{product.price}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          {hasError && (
            <p role="alert" className="text-sm text-red-700 dark:text-red-300">
              تعذّر تحميل المزيد من المنتجات. يرجى المحاولة مرة أخرى.
            </p>
          )}
          {hasMore && (
            <button
              type="button"
              onClick={() => void onLoadMore()}
              disabled={isLoadingMore}
              className="rounded-full border border-neutral-300 dark:border-neutral-600 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoadingMore
                ? "جارٍ تحميل المزيد..."
                : hasError
                  ? "إعادة المحاولة"
                  : "عرض المزيد"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
