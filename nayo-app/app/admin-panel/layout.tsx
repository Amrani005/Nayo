import SideBarNav from "@/components/SideBarNav";
import { requireOwner } from "@/lib/owner-auth";
import { connection } from "next/server";

export const instant = false;

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  await requireOwner();

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8fafc] font-['Tajawal',sans-serif] text-[#141414]">
      <SideBarNav />
      {children}
    </div>
  );
}
