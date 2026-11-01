'use server'

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache"; 
import { draftOrderStatuses } from "@/constants";

type OrderDetailsItem = {
  productId?: string;
  id?: string;
  name?: string;
  quantity?: number;
  price?: number;
  size?: string;
  sizes?: string[];
};

type OrderDetailsInput = {
  cartItems?: unknown;
  productId?: string;
  productName?: string;
  quantity?: number;
  price?: number;
  size?: string;
  wilaya?: string;
  deliveryType?: string;
};

type CheckoutOrderData = OrderDetailsInput & {
  draftId?: string | null;
  name: string;
  phone: string;
  address: string;
  total: number;
};

function serializeOrderDetails(data: OrderDetailsInput) {
  const cartItems = Array.isArray(data.cartItems)
    ? data.cartItems.filter(
        (item): item is OrderDetailsItem =>
          item !== null && typeof item === "object" && !Array.isArray(item)
      )
    : [];
  const sourceItems: OrderDetailsItem[] = cartItems.length > 0
    ? cartItems
    : [{
        productId: data.productId,
        name: data.productName,
        quantity: data.quantity,
        price: data.price,
        size: data.size,
      }];
  const items = sourceItems.map((item) => ({
    productId: item.productId || item.id,
    name: item.name || data.productName,
    quantity: Math.max(1, Number(item.quantity) || 1),
    price: Number(item.price) || 0,
    size: item.size || item.sizes?.[0] || "Standard",
    sizes: item.sizes?.filter((size) => typeof size === "string") ?? [],
  }));
  const firstItem = items[0];

  return JSON.stringify({
    ...firstItem,
    wilaya: data.wilaya,
    wilya: data.wilaya,
    deliveryType: data.deliveryType,
    items,
  });
}

export async function getProductById(id: string){
    if(!id)return ;
    const product = await db.product.findUnique({
        where:{id:id},

    })
    return product;
}
export async function saveDraftOrder(data: CheckoutOrderData) {
   const orderItems = serializeOrderDetails(data);
   
   const fullAdress = `${data.address} - ولاية: ${data.wilaya} (${data.deliveryType})`;

   let resultDraftId = null;

   if(data.draftId){
    const updatedDraft = await db.order.updateMany({
      where: {
        id: data.draftId,
        status: { in: draftOrderStatuses },
      },
      data:{
        customerName: data.name,
        customerPhone: data.phone,
        customerAddress: fullAdress,
        totalPrice: Number(data.total),
        status: "draft", 
        orderItems: orderItems, 
      }
    });
    if (updatedDraft.count !== 1) {
      throw new Error("The checkout draft could not be found or was already completed.");
    }
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
   
   revalidatePath("/admin-panel");
   revalidatePath("/admin-panel/draft");
   revalidatePath("/admin-panel/orders");

   return {draftId : resultDraftId}
}

export async function placeOrder(data: CheckoutOrderData){
    
       const orderDetail = serializeOrderDetails(data);
       const fullAdress = `${data.address}-wilaya:${data.wilaya} (${data.deliveryType})`

       const orderData = {
          customerName: data.name,
          customerPhone: data.phone,
          customerAddress: fullAdress,
          totalPrice: Number(data.total),
          status: "pending",
          orderItems: orderDetail,
       };

       const draftId = data.draftId;
       const newOrder = await db.$transaction(async (transaction) => {
         const order = await transaction.order.create({ data: orderData });

         if (draftId) {
           const deletedDraft = await transaction.order.deleteMany({
             where: {
               id: draftId,
               status: { in: draftOrderStatuses },
             },
           });

           if (deletedDraft.count !== 1) {
             throw new Error("The checkout order was not submitted because its draft could not be deleted.");
           }
         }

         return order;
       });

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
         

        revalidatePath("/admin-panel");
        revalidatePath("/admin-panel/orders");
        revalidatePath("/admin-panel/draft");

       return { success: true, orderId: newOrder.id };
    }
   
}

export async function deletDraft(formData: FormData){
  const draftId = formData.get("draftId");
  if (typeof draftId !== "string" || !draftId) {
    throw new Error("A draft order ID is required.");
  }

  const deletedDraft = await db.order.deleteMany({
    where: {
      id: draftId,
      status: { in: draftOrderStatuses },
    },
  });
  if (deletedDraft.count !== 1) {
    throw new Error("The draft order could not be found or was already removed.");
  }
   
   revalidatePath("/admin-panel");
   revalidatePath("/admin-panel/draft");
   revalidatePath("/admin-panel/orders");
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
