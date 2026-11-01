import { ArchiveRestore, MapPin, Package, Phone, Trash2, User } from "lucide-react";
import { deleteOrders } from "@/actions/deleteOrders";
import OrderStatusControl from "@/components/OrderStatusControl";

type AdminOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalPrice: number;
  status: string;
  orderItems: string;
  createdAt: Date;
};

function parseOrderDetails(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return {};
  }
  return {};
}

export default function AdminOrderLedger({orders,drafts = false,}:{orders: AdminOrder[];drafts?: boolean;}) {
  
  const statuses = drafts
    ? ["draft", "pending"]
    : ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  return (
    <div id="orders-table" data-url-section className="overflow-hidden rounded-[24px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-right">
        <thead>
          <tr>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">الطلب</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">الزبون</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">العنوان</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">التفاصيل</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">المجموع</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">الحالة</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">التاريخ</th>
            <th className="border-b border-stone-200/80 dark:border-stone-700/80 bg-stone-50/70 dark:bg-stone-900/70 px-6 py-4 text-xs font-bold text-stone-500 dark:text-stone-400">الإجراء</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
          {orders.length ? (
            orders.map((order) => {
              const details = parseOrderDetails(order.orderItems);
              const quantity =
                typeof details.quantity === "number" || typeof details.quantity === "string"
                  ? details.quantity
                  : 1;
              const wilaya =
                typeof details.wilaya === "string"
                  ? details.wilaya
                  : typeof details.wilya === "string"
                    ? details.wilya
                    : "غير محدد";
              const deliveryType =
                typeof details.deliveryType === "string" ? details.deliveryType : "غير محدد";

              return (
                <tr key={order.id} className="align-middle text-sm transition-colors hover:bg-stone-50/60 dark:hover:bg-stone-800/60">
                  <td className="whitespace-nowrap px-6 py-5 font-bold text-[#141414] dark:text-stone-100">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-sm font-bold text-[#141414] dark:text-stone-100">
                        <User className="h-3.5 w-3.5 text-stone-400 dark:text-stone-400" />
                        {order.customerName || "غير معروف"}
                      </span>
                      <span className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                        <Phone className="h-3 w-3" />
                        {order.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="max-w-48">
                      <p className="truncate text-sm font-bold text-[#141414] dark:text-stone-100">{wilaya}</p>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs font-medium text-stone-500 dark:text-stone-400" title={order.customerAddress}>
                        <MapPin className="h-3 w-3 shrink-0" />
                        {order.customerAddress || "لا يوجد عنوان"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="flex items-center gap-2 font-bold text-[#141414] dark:text-stone-100">
                        <Package className="h-3.5 w-3.5 text-stone-400 dark:text-stone-400" />
                        الكمية: {quantity}
                      </span>
                      <span className="font-medium text-stone-500 dark:text-stone-400">{deliveryType}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 font-bold text-[#141414] dark:text-stone-100">
                    {new Intl.NumberFormat("ar-DZ").format(order.totalPrice)} <span className="text-xs font-medium text-stone-500 dark:text-stone-400">دج</span>
                  </td>
                  <td className="px-6 py-5">
                    <OrderStatusControl
                      id={order.id}
                      status={order.status}
                      statuses={statuses}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-5 text-xs font-medium text-stone-500 dark:text-stone-400">
                    {new Intl.DateTimeFormat("ar-DZ", { dateStyle: "medium" }).format(order.createdAt)}
                    <span className="mt-1 block text-xs text-stone-400 dark:text-stone-400">
                      {new Intl.DateTimeFormat("ar-DZ", { hour: "2-digit", minute: "2-digit" }).format(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <form action={deleteOrders}>
                      <input type="hidden" name="id" value={order.id} />
                      <button
                        type="submit"
                        aria-label={`حذف الطلب ${order.id.slice(-6)}`}
                        className="text-stone-400 dark:text-stone-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-24 text-center">
                {drafts ? (
                  <ArchiveRestore className="mx-auto mb-4 h-8 w-8 text-stone-300 dark:text-stone-500" />
                ) : (
                  <Package className="mx-auto mb-4 h-8 w-8 text-stone-300 dark:text-stone-500" />
                )}
                <p className="font-bold text-[#141414] dark:text-stone-100">
                  {drafts ? "لا توجد طلبات غير مكتملة" : "لا توجد طلبات حتى الآن"}
                </p>
                <p className="mt-2 text-sm font-medium text-stone-500 dark:text-stone-400">
                  {drafts
                    ? "ستظهر الطلبات غير المكتملة هنا."
                    : "ستظهر طلبات الزبائن الجديدة هنا."}
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
