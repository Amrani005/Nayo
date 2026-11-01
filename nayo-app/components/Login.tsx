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
      className="relative flex min-h-screen w-full items-center justify-center bg-stone-50/70 dark:bg-stone-900/70 px-4 py-12 font-['Tajawal',sans-serif] text-[#141414] dark:text-stone-100 selection:bg-[#141414] dark:selection:bg-white selection:text-white dark:selection:text-neutral-900"
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
        className="relative z-10 w-full max-w-md rounded-[28px] border border-stone-200/80 dark:border-stone-700/80 bg-white dark:bg-stone-900 p-8 shadow-[0_8px_35px_rgb(0,0,0,0.04)] sm:p-11"
      >
        {/* Top Brand Anchor */}
        <div className="mb-8 flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-6">
          <Link
            href="/"
            className="font-serif text-2xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 transition-colors hover:text-[#b48a3e] dark:hover:text-[#d4ad65]"
          >
            نايو <span className="text-sm font-medium text-[#b48a3e] dark:text-[#d4ad65]">NAYO</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b48a3e] dark:text-[#d4ad65]">
            <Sparkles className="h-4 w-4" />
            <span>بوابة الإدارة</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#141414] dark:text-stone-100 sm:text-3xl">
            تسجيل دخول المالك
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-stone-500 dark:text-stone-400">
            أدخلي بيانات الحساب للوصول إلى لوحة تحكم متجر نايو.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-bold text-[#141414] dark:text-stone-100"
            >
              البريد الإلكتروني
            </label>
            <div className="relative flex items-center">
              <Mail className="pointer-events-none absolute right-4 h-4 w-4 text-stone-400 dark:text-stone-400" />
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="username"
                required
                placeholder="name@example.com"
                dir="ltr"
                className="w-full rounded-2xl border border-stone-200/90 dark:border-stone-700/90 bg-stone-50/60 dark:bg-stone-900/60 py-3.5 pr-11 pl-4 text-right text-sm font-medium text-[#141414] dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all focus:border-[#b48a3e] focus:bg-white dark:focus:bg-stone-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-bold text-[#141414] dark:text-stone-100"
            >
              كلمة المرور
            </label>
            <div className="relative flex items-center">
              <Lock className="pointer-events-none absolute right-4 h-4 w-4 text-stone-400 dark:text-stone-400" />
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                dir="ltr"
                className="w-full rounded-2xl border border-stone-200/90 dark:border-stone-700/90 bg-stone-50/60 dark:bg-stone-900/60 py-3.5 pr-11 pl-4 text-right text-sm font-medium tracking-widest text-[#141414] dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all focus:border-[#b48a3e] focus:bg-white dark:focus:bg-stone-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {state?.error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-red-50 dark:bg-red-950/50 px-4 py-3 text-center text-xs font-bold text-red-600 dark:text-red-400"
            >
              {state.error}
            </motion.p>
          )}

          {/* Submit Pill Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#141414] dark:bg-neutral-800 px-6 py-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-60"
            >
              <span>{isPending ? "جارٍ التحقق..." : "دخول لوحة التحكم"}</span>
              <ArrowUpLeft className="h-4 w-4 text-[#b48a3e] dark:text-[#d4ad65]" />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 border-t border-stone-100 dark:border-stone-800 pt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 dark:text-stone-400 transition-colors hover:text-[#141414] dark:hover:text-stone-100"
          >
            <ArrowRight className="h-3.5 w-3.5 text-[#b48a3e] dark:text-[#d4ad65]" />
            <span>العودة إلى المتجر</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login