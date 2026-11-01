
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { STOREFRONT_PRODUCTS_CACHE_TAG } from "@/lib/cache-tags";
import ProductsCard from "@/components/ProductsCard";

async function getStorefrontProducts() {
    "use cache";
    cacheLife("hours");
    cacheTag(STOREFRONT_PRODUCTS_CACHE_TAG);

    return db.product.findMany({
        select:{
            id:true,
            name:true,
            category:true,
            description:true,
            price:true,
            imageUrl:true,
        },
        orderBy:{
            createdAt:"desc"
        }
    });
}

export default async function Product () {
    const products = await getStorefrontProducts();
  
    return (
     <ProductsCard products={products}/>
    )
}
