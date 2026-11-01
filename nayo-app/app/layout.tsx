import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono,Tajawal, Cormorant_Garamond} from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import AdminFloatingBar from "@/components/AdminFloatingBar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif-brand",
});

export const metadata: Metadata = {
  title: "نايو | عبايات وأزياء تقليدية",
  description: "اكتشفي تشكيلة نايو من العبايات والأزياء التقليدية.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} ${cormorant.variable} h-full antialiased`}
    >
      
      <body className="min-h-full flex flex-col">
        
        {children}
        <Suspense fallback={null}>
          <AdminFloatingBar />
        </Suspense>
      </body>
      
    </html>
  );
}
