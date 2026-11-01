"use client";

import { useState } from "react";
import { LogOut, X } from "lucide-react"; 
import { motion } from 'framer-motion';
import { logoutOwner } from "@/actions/auth";

export default function LogoutButton() {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsConfirmed(true)}
       className="flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-neutral-500 hover:text-black transition-colors"
      >
        <LogOut className="w-5 h-5" /> 
        <span>تسجيل الخروج</span>
      </button>

      {isConfirmed && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center
         bg-slate-900/40 backdrop-blur-sm transition-opacity">
          
          <motion.div
            initial={{opacity:0,y:-50}}
            whileInView={{opacity:1,y:0}}
                    
          className="bg-white rounded-3xl p-8  max-w-sm w-full 
          shadow-2xl transform transition-all m-4">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-tajawal font-bold 
              text-slate-800">
                تأكيد الخروج
              </h3>
              <button 
                onClick={() => setIsConfirmed(false)}
                className="text-slate-400 hover:text-slate-700 
                transition-colors bg-slate-100 hover:bg-slate-200 p-2 
                rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 font-tajawal mb-8 text-sm leading-relaxed">
              هل أنت متأكد أنك تريد إنهاء الجلسة وتسجيل الخروج من لوحة القيادة؟
            </p>

            <div className="flex gap-3">
              <form action={logoutOwner} className="flex-1">
                <button 
                  type="submit"
                  className="w-full py-3 px-4 text-white font-tajawal font-bold bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  نعم، خروج
                </button>
              </form>
              
              <button 
                onClick={() => setIsConfirmed(false)}
                className="flex-1 py-3 px-4 text-slate-700 font-tajawal font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-300"
              >
                تراجع
              </button>
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </>
  );
}