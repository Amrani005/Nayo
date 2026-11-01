"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {  Sparkles,  Check } from "lucide-react";
import { getProductWithRelated,getRelatedProducts } from "@/actions/shop";
import CheckoutForm from "@/components/CheckoutForm";
import Category from "@/components/Category";

const ProductPage = () => {
  const params = useParams();
  const id = params.id as string;


  const [activeTab, setActiveTab] = useState<"description" | "details">("description");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<
    {
      id: string;
      name: string;
      price: number;
      imageUrl: string;
      category: string;
    }[]
  >([]);
  const [hasMoreRelatedProducts, setHasMoreRelatedProducts] = useState(false);
  const [isLoadingRelatedProducts, setIsLoadingRelatedProducts] = useState(false);
  const [relatedProductsError, setRelatedProductsError] = useState(false);
  const loadingRelatedProductsRef = useRef(false);
  const [checkOut, setCheckout] = useState(false);

  const [product, setProduct] = useState({
    id: "",
    name: "جاري التحميل...",
    category: "عبايات وأزياء تقليدية",
    description: "جاري تحميل تفاصيل المنتج...",
    price: 0,
    images: [] as string[],
    imageUrl: "",
    size: [] as string[],
  });

  useEffect(() => {
  if (!id) return;
  let ignore = false;

  const loadProduct = async () => {
    const res = await getProductWithRelated(id);
    if (ignore || !res?.product) return;

    const data = res.product;
    let galleryImages: string[] = [];

    try {
      const parsedImages = JSON.parse(data.images || "[]");
      if (Array.isArray(parsedImages)) {
        galleryImages = parsedImages.filter(
          (img): img is string => typeof img === "string" && img.length > 0
        );
      }
    } catch {
      galleryImages = [];
    }

    const allImages = Array.from(
      new Set([data.imageUrl, ...galleryImages].filter(Boolean))
    );

    let parsedSizes: string[] = [];
    if (data.size) {
      try {
        const parsed = JSON.parse(data.size);
        parsedSizes = Array.isArray(parsed)
          ? parsed
          : String(data.size).split(",").map((s) => s.trim()).filter(Boolean);
      } catch {
        parsedSizes = String(data.size).split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    setProduct({
      id: data.id,
      name: data.name,
      category: data.category || "تشكيلة الموسم",
      description: data.description ?? "لا يوجد وصف متاح لهذا المنتج حالياً.",
      price: data.price,
      imageUrl: data.imageUrl,
      images: allImages,
      size: parsedSizes,
    });

    setSelectedImage(allImages[0] || "");
    setRelatedProducts(res.related);
  };

  loadProduct();
  return () => {
    ignore = true;
  };
}, [id]);

  const loadMoreRelatedProducts = async () => {
    if (
      loadingRelatedProductsRef.current ||
      !hasMoreRelatedProducts ||
      !product.id
    ) {
      return;
    }

    loadingRelatedProductsRef.current = true;
    setIsLoadingRelatedProducts(true);
    setRelatedProductsError(false);

    try {
      const nextPage = await getRelatedProducts(
        product.category,
        product.id,
        relatedProducts.length
      );
      setRelatedProducts((currentProducts) => [
        ...currentProducts,
        ...nextPage.products,
      ]);
      setHasMoreRelatedProducts(nextPage.hasMore);
    } catch (error) {
      console.error("Failed to load more related products:", error);
      setRelatedProductsError(true);
    } finally {
      loadingRelatedProductsRef.current = false;
      setIsLoadingRelatedProducts(false);
    }
  };

  //const handleAddToCart = () => {
   // if (!selectedSize) {
  //    alert("يرجى اختيار المقاس أولاً");
   //   return;
  //  }

    //startTransition(async () => {
    //  const result = await addToCart(id, selectedSize, 1);
    //  if (result?.error) {
    //    alert(result.error);
    //  } else if (result?.success) {
    //    alert("تمت إضافة المنتج إلى السلة بنجاح");
     // }
 //   });
 // };

  const toggleCheckout = () => {
    if (!checkOut && product.size.length > 0 && !selectedSize) {
      alert("يرجى اختيار المقاس قبل إتمام الطلب");
      return;
    }
    setCheckout((prev) => !prev);
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen mb-20 bg-white dark:bg-stone-900 text-[#141414] dark:text-stone-100
       selection:bg-[#141414] dark:selection:bg-white selection:text-white dark:selection:text-neutral-900 pt-8 lg:pt-14
       "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="sticky top-28 flex flex-col w-full gap-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[28px] bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                {product.imageUrl ? (
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src={selectedImage || product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-stone-400 dark:text-stone-400 font-medium">
                    جاري تحميل الصورة...
                  </div>
                )}

                {product.category && (
                  <span className="absolute top-4 right-4 rounded-full bg-white/90 dark:bg-stone-800/90 px-4 py-1.5 text-xs font-semibold text-[#141414] dark:text-stone-100 backdrop-blur-md shadow-sm">
                    {product.category}
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-[3/4] overflow-hidden rounded-[18px] transition-all duration-200 ${
                        selectedImage === img
                          ? "ring-2 ring-[#141414] dark:ring-stone-300 ring-offset-2 dark:ring-offset-stone-950 opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover object-top"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-6 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-stone-200/80 dark:border-stone-700/80 pb-7"
            >
              <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#b48a3e] dark:text-[#d4ad65]">
                <Sparkles className="h-4 w-4" />
                <span>{product.category}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#141414] dark:text-stone-100 leading-snug mb-5">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3">
                <p className="text-2xl sm:text-3xl font-extrabold text-[#141414] dark:text-stone-100">
                  {Number(product.price).toLocaleString("ar-DZ")}
                  <span className="text-base font-semibold text-stone-500 dark:text-stone-400 mr-1.5">
                    د.ج
                  </span>
                </p>
                <span className="text-xs text-stone-400 dark:text-stone-400 font-medium">
                  شامل جميع الرسوم
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="py-7 border-b border-stone-200/80 dark:border-stone-700/80"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-[#141414] dark:text-stone-100">اختاري المقاس</h2>
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  مقاسات قياسية مريحة
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.size.length > 0 ? (
                  product.size.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedSize(item)}
                      className={`min-w-[3.5rem] px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                        selectedSize === item
                          ? "bg-[#141414] dark:bg-neutral-800 text-white shadow-md scale-105"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200/80 dark:hover:bg-stone-700/80 hover:text-[#141414] dark:hover:text-stone-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))
                ) : (
                  <div className="w-full py-4 rounded-2xl text-xs text-stone-400 dark:text-stone-400 text-center bg-stone-50 dark:bg-stone-900">
                    المقاسات غير متوفرة حالياً
                  </div>
                )}
              </div>
            </motion.div>

            <AnimatePresence>
              {product.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-6"
                >
                  <CheckoutForm
                    items={[
                      {
                        productId: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        img: product.imageUrl,
                        size: selectedSize ?? undefined,
                        quantity: 1,
                      },
                    ]}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2"
            >
              <div className="flex gap-8 border-b border-stone-200/80 dark:border-stone-700/80">
                <button
                  type="button"
                  onClick={() => setActiveTab("description")}
                  className={`pb-3.5 text-sm font-bold transition-colors relative ${
                    activeTab === "description"
                      ? "text-[#141414] dark:text-stone-100"
                      : "text-stone-400 dark:text-stone-400 hover:text-[#141414] dark:hover:text-stone-100"
                  }`}
                >
                  وصف القطعة
                  {activeTab === "description" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#141414] dark:bg-neutral-800"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`pb-3.5 text-sm font-bold transition-colors relative ${
                    activeTab === "details"
                      ? "text-[#141414] dark:text-stone-100"
                      : "text-stone-400 dark:text-stone-400 hover:text-[#141414] dark:hover:text-stone-100"
                  }`}
                >
                  تفاصيل العناية والمميزات
                  {activeTab === "details" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#141414] dark:bg-neutral-800"
                    />
                  )}
                </button>
              </div>

              <div className="py-6 min-h-[140px]">
                <AnimatePresence mode="wait">
                  {activeTab === "description" ? (
                    <motion.p
                      key="desc"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm leading-relaxed text-stone-600 dark:text-stone-300"
                    >
                      {product.description}
                    </motion.p>
                  ) : (
                    <motion.ul
                      key="details"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm leading-relaxed text-stone-600 dark:text-stone-300 flex flex-col gap-2.5"
                    >
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />
                        <span>قماش عالي الجودة بقصة انسيابية مريحة</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />
                        <span>تطريز متقن يحافظ على رونقه مع الاستخدام</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />
                        <span>يُنصح بالغسيل اليدوي أو بدرجة حرارة منخفضة</span>
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Category
        products={relatedProducts}
        hasMore={hasMoreRelatedProducts}
        isLoadingMore={isLoadingRelatedProducts}
        hasError={relatedProductsError}
        onLoadMore={loadMoreRelatedProducts}
      />
    </div>
  );
};

export default ProductPage;