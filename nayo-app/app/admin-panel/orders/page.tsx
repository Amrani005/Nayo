import { Suspense } from "react";
import { db } from "@/lib/db";
import AdminOrderLedger from "@/components/AdminOrderLedger";

export default function OrdersPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
      <div className="mb-10 border-b border-stone-200/80 dark:border-stone-700/80 pb-8">
        <p className="mb-2 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">إدارة متجر نايو</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-4xl">الطلبات</h1>
        <p className="mt-2.5 text-sm font-medium text-stone-500 dark:text-stone-400">
          راجعي بيانات الزبائن، وحدّثي حالات الطلبات، وتابعي المعاملات.
        </p>
      </div>
      <Suspense fallback={<p className="py-16 text-sm font-medium text-stone-500 dark:text-stone-400">جارٍ تحميل الطلبات...</p>}>
        <OrdersTable />
      </Suspense>
    </main>
  );
}

async function OrdersTable() {
  const orders = await db.order.findMany({
    where: { status: { not: "draft" } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminOrderLedger orders={orders} />
    </>
  );
}
