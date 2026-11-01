

export interface Slide {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  image: string; // Replace with your Cloudinary URLs or local paths later
  ctaLink: string;
}

export const SLIDES: Slide[] = [
  {
    id: "1",
    number: "01",
    label: "فخامة الأسود بلمسة ذهبية",
    title: "إصدارات محدودة\nبأناقة استثنائية",
    description:
      "تشكيلات حصرية تُصنع بكميات محدودة من أقمشة فاخرة وتفاصيل دقيقة.",
    image: "/3200.JPG",
    ctaLink: "#products",
  },
  {
    id: "2",
    number: "02",
    label: "عبايات ملكية لإطلالة راقية",
    title: "أناقة تناسب\nكل يوم",
    description:
      "تصاميم مريحة وعملية بقصّات واسعة وخياطة متقنة تدوم طويلاً.",
    image: "/3900.JPG",
    ctaLink: "#products",
  },
  {
    id: "3",
    number: "03",
    label: "طرز تقليدي بألوان ساحرة",
    title: "حيث يلتقي الفن\nبالأناقة",
    description:
      "تفاصيل جريئة ولمسات بسيطة تجتمع في قطع مميزة لإطلالتك اليومية.",
    image: "/3607.JPG",
    ctaLink: "#products",
  },
  {
    id: "4",
    number: "04",
    label: "نعومة البيج وفخامة القطيفة",
    title: "تصاميم عصرية\nبروح متجددة",
    description:
      "قصّات عصرية وخامات مختارة تجمع بين الراحة والأناقة العملية.",
    image: "/2626.JPG",
    ctaLink: "#products",
  },
  
];

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "كل المنتجات", href: "#products" },
  { label: "عبايات", href: "/?category=abayas#products" },
  { label: "قنادر", href: "/?category=gandouras#products" },
  
];

export const orderStatuses: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
  draft: "مسودة",
};

export const orderStatusColors: Record<string, string> = {
  pending: "bg-orange-100 text-orange-800",
  confirmed: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  draft: "bg-stone-100 text-stone-700",
};
