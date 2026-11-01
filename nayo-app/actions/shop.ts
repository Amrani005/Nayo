'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache"; 

//Method to get the product data
export async function getProductById(id: string){
    if(!id)return ;
    const product = await db.product.findUnique({
        where:{id:id},

    })
    return product;
}
export async function saveDraftOrder(data: any) {
   const orderItems = JSON.stringify({
     productId : data.productId,
     quantity: data.quantity,
     price: data.price,
     wilya : data.wilaya, 
     deliveryType: data.deliveryType,
     size: data.size || "Standard"
   });
   
   const fullAdress = `${data.address} - ولاية: ${data.wilaya} (${data.deliveryType})`;

   let resultDraftId = null;

   if(data.draftId){
    await db.order.update({
      where : {id : data.draftId},
      data:{
        customerName: data.name,
        customerPhone: data.phone,
        customerAddress: fullAdress,
        totalPrice: Number(data.total),
        status: "draft", 
        orderItems: orderItems, 
      }
    });
    resultDraftId = data.draftId;
   } else {
    const newDraft = await db.order.create({
      data:{
         customerName: data.name,
        customerPhone: data.phone,
        customerAddress: fullAdress,
        totalPrice: Number(data.total),
        status: "draft", 
        orderItems: orderItems, 
      }
    });
    resultDraftId = newDraft.id;

    if (data.phone) {
        const baserowData = {
            "Name": data.name || "بدون اسم",
            "Phone": data.phone,
            "Wilaya": data.wilaya,
            "Address": fullAdress,     
            "Product": data.productName || "منتج",
            "Price": data.total?.toString() || "0",
            "Delivery": "غير محدد",
            "Status": "مسودة (Draft)", 
            "Date": new Date().toLocaleString('ar-DZ')
        };
       
    }
   }
   
   revalidatePath("/dashboard/draft");
   revalidatePath("/dashboard/orders");
   revalidatePath("/dashboard");

   return {draftId : resultDraftId}
}

export async function placeOrder(data:any){
    
       const orderDetail = JSON.stringify({
          productId : data.productId,
          quantity: data.quantity,
          price: data.price,
          wilya : data.wilaya,
          deliveryType: data.deliveryType,
          size: data.size || "Standard"
       })
       const fullAdress = `${data.address}-wilaya:${data.wilaya} (${data.deliveryType})`

       const newOrder = await db.order.create({
        data:{
            customerName: data.name,
            customerPhone: data.phone,
            customerAddress: fullAdress,
            totalPrice: Number(data.total),
            status: "pending", 
            orderItems: orderDetail,
        }
       })

       if (newOrder) {
          const baserowData = {
            "Name": data.name,
            "Phone": data.phone,
            "Wilaya": data.wilaya,
            "Address": fullAdress,
            "Product": data.productName || "منتج",
            "Price": data.total.toString(),
            "Delivery": data.deliveryType,
            "Status": "طلب جديد (New)", 
            "Date": new Date().toLocaleString('ar-DZ')
        };
         

        revalidatePath("/dashboard/orders");
        revalidatePath("/dashboard/draft");
        revalidatePath("/dashboard");

       return { success: true, orderId: newOrder.id };
    }
   
}

export async function deletDraft(formData: FormData){
  const draftId = formData.get("draftId") as string;
   await db.order.deleteMany({
    where:{
      id:draftId
    }
   });
   
   revalidatePath("/dashboard/draft");
   revalidatePath("/dashboard");
}
 export async function getProductWithRelated(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    const related = await db.product.findMany({
      where: {
        category: product.category,
        NOT: { id: product.id },
      },
      take: 4,
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        category: true,
      },
    });

    return { product, related };
  } catch (error) {
    console.error("Error fetching product with related:", error);
    return null;
  }
}

const RELATED_PRODUCTS_PAGE_SIZE = 4;

export async function getRelatedProducts(
  category: string,
  productId: string,
  offset = 0
) {
  if (!category || !productId) {
    throw new Error("A category and product ID are required.");
  }
  if (!Number.isSafeInteger(offset) || offset < 0) {
    throw new Error("The related-products offset must be a non-negative integer.");
  }

  const products = await db.product.findMany({
    where: {
      category,
      id: { not: productId },
      isArchived: false,
    },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      category: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: offset,
    take: RELATED_PRODUCTS_PAGE_SIZE + 1,
  });

  return {
    products: products.slice(0, RELATED_PRODUCTS_PAGE_SIZE),
    hasMore: products.length > RELATED_PRODUCTS_PAGE_SIZE,
  };
}

