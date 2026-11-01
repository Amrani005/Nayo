import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, ShoppingBag, FileClock, Package, Plus, X, Menu } from "lucide-react";

const SideBarNav = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" className="hidden peer" />
      <label
        htmlFor="sidebar-toggle"
        aria-label="إغلاق القائمة"
        className="fixed inset-0 z-40 hidden cursor-pointer bg-black/20 backdrop-blur-sm transition-opacity peer-checked:block"
      />
      <aside className="fixed right-0 top-0 z-50 flex h-full w-72 translate-x-full flex-col border-l border-stone-200 bg-white transition-transform duration-300 ease-in-out peer-checked:translate-x-0">
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-6">
          <div className="text-sm font-bold text-[#141414]">إدارة متجر نايو</div>
          <label
            htmlFor="sidebar-toggle"
            aria-label="إغلاق القائمة"
            className="flex cursor-pointer items-center justify-center text-stone-400 transition-colors hover:text-[#b48a3e]"
          >
            <X className="h-5 w-5" />
          </label>
        </div>
        <nav aria-label="القائمة الرئيسية" className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <Link
            href="/admin-panel"
            className="flex items-center gap-4 rounded-xl px-4 py-4 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-[#b48a3e]"
          >
            <LayoutDashboard className="h-4 w-4 text-[#b48a3e]" />
            لوحة التحكم
          </Link>
          <Link
            href="/admin-panel/orders"
            className="flex items-center gap-4 rounded-xl px-4 py-4 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-[#b48a3e]"
          >
            <ShoppingBag className="h-4 w-4 text-[#b48a3e]" />
            الطلبات
          </Link>
          <Link
            href="/admin-panel/draft"
            className="flex items-center gap-4 rounded-xl px-4 py-4 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-[#b48a3e]"
          >
            <FileClock className="h-4 w-4 text-[#b48a3e]" />
            الطلبات غير المكتملة
          </Link>
          <Link
            href="/admin-panel/products"
            className="flex items-center gap-4 rounded-xl px-4 py-4 text-xs font-bold text-stone-600 transition-colors hover:bg-stone-50 hover:text-[#b48a3e]"
          >
            <Package className="h-4 w-4 text-[#b48a3e]" />
            المنتجات
          </Link>
        </nav>
        <div className="border-t border-stone-200 p-6">
          <Link
            href="/admin-panel/products/add"
            className="flex w-full items-center justify-center gap-3 rounded-full bg-[#141414] px-4 py-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 text-[#b48a3e]" />
            <span>إضافة منتج</span>
          </Link>
        </div>
      </aside>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 selection:bg-[#141414] selection:text-white sm:px-8">
        <Link href="/admin-panel" className="text-sm font-bold tracking-wide">
          <img src="nayo.jfif" alt=" نايو" className="h-10 w-10" />

        </Link>
        <div className="flex items-center gap-4">
          <label
            htmlFor="sidebar-toggle"
            aria-label="فتح القائمة"
            className="flex cursor-pointer items-center justify-center rounded-full border border-stone-200 px-4 py-3 text-stone-500 transition-colors hover:border-[#b48a3e] hover:text-[#b48a3e]"
          >
            <Menu className="h-5 w-5" />
          </label>
          <LogoutButton />
        </div>
      </header>
    </>
  );
};

export default SideBarNav;