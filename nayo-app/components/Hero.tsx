"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {ArrowLeft} from "lucide-react" ;
import { SLIDES, Slide } from "@/constants";
import Header from "./Header";





export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(3);
  const SLIDE_DURATION = 5000; 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const currentSlide = SLIDES[currentIndex];

  return (
    
      <div id="hero" className="relative font-tajawal mx-auto h-[600px] md:h-[680px] w-full overflow-hidden  bg-[#141414] dark:bg-neutral-800
       text-white shadow-2xl ">
        
        
        {/* Background Image Slider */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.label}
              loading={index === currentIndex ? "eager" : "lazy"}
              fetchPriority={index === currentIndex ? "high" : "auto"}
              className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
            />
            {/* Dark Gradient Overlays for text readability matching the screenshot */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-20 flex h-full flex-col justify-end p-6 sm:p-10 md:p-14">
          
          {/* Main Left Text & Button */}
          <div className="mb-10 max-w-xl">
            

            {/* "Shop now" Pill Button with circular arrow */}
            <div className="mt-7">
              <Link
                href={currentSlide.ctaLink}
                className="group inline-flex items-center gap-3
                 rounded-full border border-zinc-700 bg-transparent pl-1.5 pr-5 py-1.5 text-sm 
                 font-semibold text-white transition-transform 
                 duration-200 hover:scale-105 active:scale-95"
              >
                
                <span>تسوق الان</span>
                <span className="flex h-8 w-8 items-center 
                justify-center rounded-full 
                 text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  
                    <ArrowLeft className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-5 sm:gap-6 border-t border-white/15">
            {SLIDES.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`group relative text-left transition-opacity duration-300 pt-3 ${
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-75"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -top-[17px] left-0 right-0 h-[2.5px] bg-white dark:bg-stone-900 transition-all duration-500" />
                  )}

                  <span className="block text-xs font-bold tracking-wider text-white sm:text-sm">
                    {slide.number}
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-neutral-300 sm:text-xs">
                    {slide.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
   
  );
}