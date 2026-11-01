import Link from "next/link";
import { ArchiveRestore,Icon, ArrowUpLeft, Package, Plus, ShoppingBag } from "lucide-react";
import { db } from "@/lib/db";
import { draftOrderStatuses, orderStatusColors, orderStatuses } from "@/constants";
import { count } from "console";



const formatPrice = (price: number) =>
  `${new Intl.NumberFormat("ar-DZ").format(price)} دج`;

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ar-DZ", { dateStyle: "medium" }).format(date);

 

export default async function DashboardOverview({}) {
  const [productsCount, ordersCount, draftsCount, recentOrders] = await Promise.all([
    db.product.count(),
    db.order.count({
      where: { status: { notIn: draftOrderStatuses } },
    }),
    db.order.count({
      where: { status: { in: draftOrderStatuses } },
    }),
    db.order.findMany({
      where: { status: { notIn: draftOrderStatuses } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, customerName: true, totalPrice: true, status: true, createdAt: true },
    }),
  ]);

  const stats = [
    { href: "/admin-panel/orders", label: "الطلبات",  Icon: ShoppingBag ,count:ordersCount},
    { href: "/admin-panel/draft", label: "الطلبات غير المكتملة",  Icon: ArchiveRestore ,count:draftsCount},
    { href: "/admin-panel/products", label: "المنتجات",  Icon: Package ,count:productsCount},
  ];
  


 return (
  <div dir="rtl" className="font-['Tajawal',sans-serif] text-[#141414] dark:text-stone-100">
    <div className="mb-10 flex flex-col gap-6 border-b border-stone-200/80 dark:border-stone-700/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">
          إدارة متجر نايو
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-4xl">
          لوحة التحكم
        </h1>
        <p className="mt-2.5 text-sm font-medium text-stone-500 dark:text-stone-400">
          تابعي المنتجات وطلبات الزبائن والطلبات غير المكتملة.
        </p>
      </div>

      <Link
        href="/admin-panel/products/add"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#141414] dark:bg-neutral-800 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95"
      >
        <Plus className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />
        <span>إضافة منتج</span>
      </Link>
    </div>

    <section
      id="store-statistics"
      data-url-section
      aria-label="إحصائيات المتجر"
      className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {stats.map(({ href, label, Icon,count }) => (
        <Link
          href={href}
          key={label}
          className="group flex flex-col justify-between rounded-[24px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#b48a3e]/50 hover:shadow-[0_14px_35px_rgb(0,0,0,0.07)]"
        >
          <div className="mb-8 flex items-center justify-between">
            <Icon className="h-6 w-6 text-[#b48a3e] dark:text-[#d4ad65] transition-transform duration-300 group-hover:scale-110" />
            <ArrowUpLeft className="h-5 w-5 text-stone-300 dark:text-stone-500 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#141414] dark:group-hover:text-stone-100" />
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-stone-500 dark:text-stone-400">
              {label}
            </p>
            <p className="text-4xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-5xl">
              {count}
            </p>
          </div>
        </Link>
      ))}
    </section>

    <section id="recent-orders" data-url-section>
      <div className="mb-5 flex items-end justify-between border-b border-stone-200/80 dark:border-stone-700/80 pb-4">
        <h2 className="text-xl font-bold tracking-tight text-[#141414] dark:text-stone-100">
          أحدث الطلبات
        </h2>
        <Link
          href="/admin-panel/orders"
          className="text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65] transition-colors hover:text-[#141414] dark:hover:text-stone-100"
        >
          عرض الكل
        </Link>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-right">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 text-xs text-stone-500 dark:text-stone-400">
                <th className="px-6 py-4 font-bold">الطلب</th>
                <th className="px-6 py-4 font-bold">الزبون</th>
                <th className="px-6 py-4 font-bold">المجموع</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {recentOrders.length ? (
                recentOrders.map((order: any) => (
                  <tr
                    key={order.id}
                    className="text-sm transition-colors hover:bg-stone-50/60 dark:hover:bg-stone-800/60"
                  >
                    <td className="px-6 py-4 font-bold text-[#141414] dark:text-stone-100">
                      #{order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#141414] dark:text-stone-100">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#141414] dark:text-stone-100">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${orderStatusColors[order.status] ?? "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200"}`}>
                        {orderStatuses[order.status] ?? "غير محددة"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-stone-500 dark:text-stone-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-14 text-center text-sm font-medium text-stone-400 dark:text-stone-400"
                  >
                    لا توجد طلبات حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
);
}