import { Suspense } from "react";
import { db } from "@/lib/db";
import AdminOrderLedger from "@/components/AdminOrderLedger";

export default function DraftOrdersPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-10 border-b border-stone-200/80 dark:border-stone-700/80 pb-8">
        <p className="mb-2 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">إدارة متجر نايو</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-4xl">الطلبات غير المكتملة</h1>
        <p className="mt-2.5 text-sm font-medium text-stone-500 dark:text-stone-400">
          تابعي الطلبات غير المكتملة وأعيديها إلى قائمة الطلبات النشطة.
        </p>
      </div>
      <Suspense fallback={<p className="py-16 text-sm font-medium text-stone-500 dark:text-stone-400">جارٍ تحميل الطلبات غير المكتملة...</p>}>
        <DraftOrdersTable />
      </Suspense>
    </main>
  );
}

async function DraftOrdersTable() {
  const orders = await db.order.findMany({
    where: { status: "draft" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminOrderLedger orders={orders} drafts />
    </>
  );
}
