import { Suspense } from "react";

import DashboardOverview from "@/components/DashboardOverview";



export default function AdminPanelPage() {
  return (
    <main dir="rtl" className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 lg:px-12 lg:py-16">
      <Suspense fallback={<p className="py-16 text-sm font-medium text-stone-500 dark:text-stone-400">جارٍ تحميل لوحة التحكم...</p>}>
        <DashboardOverview />
      </Suspense>
    </main>
  );
}

