import { Suspense } from "react";
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import Product from '@/components/Product'
import Footer from "@/components/Footer";
const page = () => {
  return (
    <div>
      <Suspense fallback={<div className="h-20" />}>
        <Header/>
      </Suspense>
      <Hero/>
      <Suspense fallback={<div className="min-h-96" aria-label="Loading products" />}>
        <Product/>
      </Suspense>
      <Footer/>
    </div>
  )
}

export default page
