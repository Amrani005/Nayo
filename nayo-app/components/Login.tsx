"use client";

import { useActionState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpLeft, ArrowRight, Lock, Mail } from "lucide-react";
import { loginOwner } from "@/actions/auth";

const Login = () => {
  const [state, formAction, isPending] = useActionState(loginOwner, null);

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full items-center justify-center bg-stone-50/70 px-4 py-12 font-['Tajawal',sans-serif] text-[#141414] selection:bg-[#141414] selection:text-white"
    >
      {/* Subtle warm radial glow in background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-[#b48a3e]/5 blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-stone-200/60 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-[28px] border border-stone-200/80 bg-white p-8 shadow-[0_8px_35px_rgb(0,0,0,0.04)] sm:p-11"
      >
        {/* Top Brand Anchor */}
        <div className="mb-8 flex items-center justify-between border-b border-stone-100 pb-6">
          <Link
            href="/"
            className="font-serif text-2xl font-extrabold tracking-tight text-[#141414] transition-colors hover:text-[#b48a3e]"
          >
            نايو <span className="text-sm font-medium text-[#b48a3e]">NAYO</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b48a3e]">
            <Sparkles className="h-4 w-4" />
            <span>بوابة الإدارة</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#141414] sm:text-3xl">
            تسجيل دخول المالك
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-stone-500">
            أدخلي بيانات الحساب للوصول إلى لوحة تحكم متجر نايو.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-bold text-[#141414]"
            >
              البريد الإلكتروني
            </label>
            <div className="relative flex items-center">
              <Mail className="pointer-events-none absolute right-4 h-4 w-4 text-stone-400" />
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="username"
                required
                placeholder="name@example.com"
                dir="ltr"
                className="w-full rounded-2xl border border-stone-200/90 bg-stone-50/60 py-3.5 pr-11 pl-4 text-right text-sm font-medium text-[#141414] placeholder:text-stone-400 transition-all focus:border-[#b48a3e] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-bold text-[#141414]"
            >
              كلمة المرور
            </label>
            <div className="relative flex items-center">
              <Lock className="pointer-events-none absolute right-4 h-4 w-4 text-stone-400" />
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                dir="ltr"
                className="w-full rounded-2xl border border-stone-200/90 bg-stone-50/60 py-3.5 pr-11 pl-4 text-right text-sm font-medium tracking-widest text-[#141414] placeholder:text-stone-400 transition-all focus:border-[#b48a3e] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-600"
            >
              {state.error}
            </motion.p>
          )}

          {/* Submit Pill Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#141414] px-6 py-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60"
            >
              <span>{isPending ? "جارٍ التحقق..." : "دخول لوحة التحكم"}</span>
              <ArrowUpLeft className="h-4 w-4 text-[#b48a3e]" />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 border-t border-stone-100 pt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 transition-colors hover:text-[#141414]"
          >
            <ArrowRight className="h-3.5 w-3.5 text-[#b48a3e]" />
            <span>العودة إلى المتجر</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login