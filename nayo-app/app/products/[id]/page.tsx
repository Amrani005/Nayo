import { Suspense } from "react";
import Header from '@/components/Header'
import ProductPage from '@/components/ProductPage'
import Footer from "@/components/Footer";

const page = () => {
  return (
    <div className='flex flex-col mt-15 gap-10'>
      <Suspense fallback={<div className="h-20" />}>
        <Header/>
      </Suspense>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ProductPage/>
      </Suspense>
      <Footer/>
      
    </div>
  )
}

export default page
