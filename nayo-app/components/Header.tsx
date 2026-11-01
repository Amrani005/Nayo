"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto flex h-16 md:h-20 w-full items-center justify-between px-4 sm:px-7 text-[#141414] dark:text-stone-100 shadow-2xl backdrop-blur-md">
        <Link href="/#hero" className="flex items-center gap-3.5 group">
          <div className="relative h-11 w-11 md:h-12 md:w-12 overflow-hidden rounded-full shadow-sm transition-transform duration-300 group-hover:scale-105">
            <img
              src="/nayo.jfif"
              alt="Nayo Modest Wear"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold tracking-[0.18em] uppercase text-[#141414] dark:text-stone-100">
              NAYO
            </span>
            <span className="text-[11px] font-medium tracking-normal text-stone-500 dark:text-stone-400 -mt-1">
              عبايات وأزياء تقليدية
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <a
            href="#products"
            className="hidden sm:inline-flex group items-center gap-2.5 rounded-full pl-4 pr-1.5 py-1.5 text-xs md:text-sm font-medium text-white transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <span>اكتشفي التشكيلة</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-stone-900 text-[#141414] dark:text-stone-100 transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-full text-[#141414] dark:text-stone-100"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            dir="rtl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-4 right-4 top-full mt-2 max-w-7xl mx-auto overflow-hidden rounded-[22px] backdrop-blur-2xl p-5 text-[#141414] dark:text-stone-100 shadow-2xl md:hidden"
          >
            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-stone-700 dark:bg-stone-600 text-white font-semibold"
                        : "text-stone-700 dark:text-stone-200 font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-50" />
                  </Link>
                );
              })}

              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
                <a
                  href="#products"
                  onClick={() => setMobileMenuOpen(false)}
                  onClickCapture={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-700 dark:bg-stone-600 py-3 text-sm font-semibold text-white"
                >
                  <span>اكتشفي التشكيلة</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}