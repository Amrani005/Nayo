"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/updateOrderStatus";
import { orderStatusColors, orderStatuses } from "@/constants";

export default function OrderStatusControl({
  id,
  status,
  statuses,
}: {
  id: string;
  status: string;
  statuses: string[];
}) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-start gap-2">
      <select
        value={selectedStatus}
        aria-label={`حالة الطلب ${id.slice(-6)}`}
        disabled={isPending}
        className={`max-w-36 rounded-full border border-stone-200 dark:border-stone-700 px-3 py-2 text-xs font-bold outline-none focus:border-[#b48a3e] disabled:cursor-wait disabled:opacity-70 ${orderStatusColors[selectedStatus] ?? "bg-white dark:bg-stone-900 text-[#141414] dark:text-stone-100"}`}
        onChange={(event) => {
          const nextStatus = event.currentTarget.value;
          setSelectedStatus(nextStatus);

          const formData = new FormData();
          formData.set("id", id);
          formData.set("status", nextStatus);
          startTransition(() => updateOrderStatus(formData));
        }}
      >
        {!statuses.includes(status) && (
          <option value={status}>{orderStatuses[status] ?? "غير محددة"}</option>
        )}
        {statuses.map((nextStatus) => (
          <option key={nextStatus} value={nextStatus}>
            {orderStatuses[nextStatus] ?? "غير محددة"}
          </option>
        ))}
      </select>
      
    </div>
  );
}
