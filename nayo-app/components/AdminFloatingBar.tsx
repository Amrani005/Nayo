"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, ArrowUpLeft } from "lucide-react";
import { checkIsOwner } from "@/actions/auth";

export default function AdminFloatingBar() {
  const [isOwner, setIsOwner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    checkIsOwner().then((res) => setIsOwner(res));
  }, []);

  if (!isOwner || pathname.startsWith("/admin-panel") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-full border border-stone-700/80 dark:border-stone-500/80 bg-[#141414]/95 p-1.5 pr-4 text-xs font-bold text-white shadow-[0_10px_30px_rgb(0,0,0,0.25)] backdrop-blur-md font-['Tajawal',sans-serif]"
    >
      <span className="flex items-center gap-1.5 text-[#b48a3e] dark:text-[#d4ad65]">
        <LayoutDashboard className="h-4 w-4" />
        <span>وضع المالك</span>
      </span>

      <div className="mx-1 h-4 w-[1px] bg-stone-700 dark:bg-stone-600" />

      <Link
        href="/admin-panel/products/add"
        className="flex items-center gap-1 rounded-full bg-stone-800 dark:bg-stone-700 px-3 py-1.5 text-white transition-colors hover:bg-stone-700 dark:hover:bg-stone-600"
      >
        <Plus className="h-3.5 w-3.5 text-[#b48a3e] dark:text-[#d4ad65]" />
        <span>إضافة منتج</span>
      </Link>

      <Link
        href="/admin-panel"
        className="flex items-center gap-1 rounded-full bg-[#b48a3e] px-3.5 py-1.5 text-[#141414] dark:text-stone-100 transition-transform hover:scale-105"
      >
        <span>لوحة التحكم</span>
        <ArrowUpLeft className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}