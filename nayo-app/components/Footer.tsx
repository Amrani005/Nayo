
import React from "react";
import Link from "next/link";
import {  Lock, Sparkles, ArrowUpLeft } from "lucide-react";

const Footer = () => {
  return (
    <footer
      dir="rtl"
      className="w-full border-t border-stone-200/80 dark:border-stone-700/80 bg-stone-50/60 dark:bg-stone-900/60 font-['Tajawal',sans-serif] text-[#141414] dark:text-stone-100"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Link
              href="/"
              className="inline-flex items-baseline gap-2  text-3xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 transition-colors hover:text-[#b48a3e] dark:hover:text-[#d4ad65]"
            >
              <span>نايو</span>
              <span className="text-sm  tracking-widest text-[#b48a3e] dark:text-[#d4ad65]">
                NAYO
              </span>
            </Link>
            <p className="mt-2.5 max-w-sm text-sm font-medium leading-relaxed text-stone-500 dark:text-stone-400">
              أزياء محتشمة وعبايات راقية بتفاصيل أنيقة تجمع بين الأصالة والفخامة العصرية.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">
             
              <span>تابعينا على إنستغرام</span>
            </span>

            <a
              href="https://www.instagram.com/nayo_2023/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#141414] dark:bg-neutral-800 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              <span>حساب المتجر الرسمي</span>
              <ArrowUpLeft className="h-3.5 w-3.5 text-stone-400 dark:text-stone-400 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-stone-200/70 dark:border-stone-700/70 pt-6 text-xs font-medium text-stone-400 dark:text-stone-400 sm:flex-row">
          <p>
            ©  متجر نايو (NAYO). جميع الحقوق محفوظة.
          </p>

          <Link
            href="/admin-panel"
            className="inline-flex items-center gap-1.5 text-stone-400 dark:text-stone-400 transition-colors hover:text-[#b48a3e] dark:hover:text-[#d4ad65]"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>بوابة الإدارة</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;