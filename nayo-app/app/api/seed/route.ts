import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";
import { requireOwner } from "@/lib/owner-auth";
import path from "path";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type InitialProduct = {
  name: string;
  category: string;
  price: number;
  description: string;
  possibleFiles: string[];
  size: string;
};

type ProductToCreate = Omit<InitialProduct, "possibleFiles"> & {
  imageUrl: string;
  images: string;
};

const siteProduct = (
  name: string,
  category: "عبايات" | "قنادر",
  price: number,
  description: string,
  fileName: string,
  additionalFileNames: string[] = []
): InitialProduct => ({
  name,
  category: category === "عبايات" ? "Abayas" : "Gandouras",
  price,
  description,
  possibleFiles: [`Site/${fileName}`, ...additionalFileNames.map((file) => `Site/${file}`)],
  size: "S, M, L, XL",
});

const INITIAL_PRODUCTS: InitialProduct[] = [
  siteProduct(
    "عباية سوداء ملكية بتفاصيل ذهبية",
    "عبايات",
    3200,
    "عباية سوداء أنيقة بتفاصيل ذهبية عند الصدر والخصر لإطلالة راقية.",
    "3200.JPG"
  ),
  siteProduct(
    "عباية سوداء بتطريز ذهبي",
    "عبايات",
    3900,
    "عباية سوداء واسعة بتفاصيل ذهبية أنيقة على الواجهة والأكمام.",
    "3900.JPG"
  ),
  siteProduct(
    "عباية وردية بتطريز أنيق على الأكمام",
    "عبايات",
    4500,
    "عباية طويلة باللون الوردي الهادئ مع تطريز مزخرف على الأكمام، مناسبة للإطلالات اليومية والمناسبات.",
    "0AA11FA5-9CD3-4385-B115-760910980104.JPG"
  ),
  siteProduct(
    "طقم منزلي بيج بقميص وبنطال",
    "قنادر",
    3500,
    "طقم مريح بلون بيج دافئ يتكون من قميص بأزرار وبنطال واسع لإطلالة عملية وأنيقة.",
    "0F3A14E5-3316-459E-B723-DFCE43303E5A.JPG"
  ),
  siteProduct(
    "عباية سوداء مفتوحة بتفاصيل ملونة",
    "عبايات",
    3900,
    "عباية سوداء واسعة ومفتوحة بتفاصيل مطرزة بألوان هادئة على الواجهة لإطلالة عصرية.",
    "1637f7bf-7e03-45f1-a98c-b84e90f91bc6.JPG"
  ),
  siteProduct(
    "فستان زيتي قصير بحزام",
    "قنادر",
    2500,
    "فستان أنيق باللون الزيتي مع ياقة وأزرار أمامية وحزام يحدد الخصر.",
    "2500da.jpg"
  ),
  siteProduct(
    "قندورة برتقالية بنقشة مستوحاة من الطبيعة",
    "قنادر",
    2800,
    "قندورة خفيفة باللون البرتقالي ونقشة بارزة باللون البني، بقصة واسعة ومريحة.",
    "2800.JPG"
  ),
  siteProduct(
    "قندورة طويلة بنقشة زرقاء وذهبية",
    "قنادر",
    3500,
    "قندورة طويلة بنقشة غنية بالأزرق والذهبي مع أكمام واسعة لإطلالة لافتة.",
    "29c95196-ccd8-4d32-af3f-7325b99114f0.JPG"
  ),
  siteProduct(
    "قندورة بنية طويلة بقصة بسيطة",
    "قنادر",
    3000,
    "قندورة يومية طويلة بلون بني كلاسيكي وقصة فضفاضة تمنح الراحة والأناقة.",
    "3000.JPG"
  ),
  siteProduct(
    "قندورة زرقاء بحزام وتفاصيل ذهبية",
    "قنادر",
    3200,
    "قندورة زرقاء زاهية مزينة بشريط ذهبي وحزام خصر لإطلالة تقليدية أنيقة.",
    "3200da.JPG"
  ),
  siteProduct(
    "فستان مخملي وردي بتفاصيل ناعمة",
    "قنادر",
    2900,
    "فستان مخملي بلون وردي ترابي وقصة أنثوية أنيقة، بسعر العرض.",
    "3500 promo 2900.jpg"
  ),
  siteProduct(
    "عباية بيضاء وسوداء بنقشة هندسية",
    "عبايات",
    3000,
    "عباية واسعة بتصميم أبيض وأسود ونقشة هندسية مميزة، مناسبة لإطلالة يومية محتشمة.",
    "3500 promo 3000.jpg"
  ),
  siteProduct(
    "قندورة وردية طويلة بحزام",
    "قنادر",
    3500,
    "قندورة وردية طويلة بتصميم ناعم وحزام خصر رفيع لإطلالة أنثوية مريحة.",
    "3500daa.JPG"
  ),
  siteProduct(
    "قندورة فوشيا مطرزة عند الصدر",
    "قنادر",
    3600,
    "قندورة فوشيا بأكمام واسعة وتطريز ذهبي أنيق عند الياقة والصدر.",
    "3600 (2).jpg"
  ),
  siteProduct(
    "عباية سوداء بخطوط ذهبية طولية",
    "عبايات",
    3600,
    "عباية سوداء مفتوحة بخطوط ذهبية رفيعة على الواجهة والأكمام، بقصة واسعة وأنيقة.",
    "3600.JPG"
  ),
  siteProduct(
    "قندورة زرقاء ملكية بتطريز أبيض",
    "قنادر",
    3600,
    "قندورة زرقاء واسعة بتفاصيل بيضاء متناسقة على الياقة والحواف.",
    "3600daa.jpg"
  ),
  siteProduct(
    "قندورة حمراء بتطريز تقليدي ملون",
    "قنادر",
    3600,
    "قندورة حمراء بقصة واسعة وتطريز تقليدي ملون يزين الصدر والواجهة.",
    "3600Ï»Ï¼.JPG"
  ),
  siteProduct(
    "عباية بنقشة جلد النمر بالبنفسجي",
    "عبايات",
    3900,
    "عباية طويلة بنقشة جريئة بدرجات البنفسجي والبني مع أكمام واسعة.",
    "374cea51-b6e2-477f-be77-ba84d1e9d6ad.JPG"
  ),
  siteProduct(
    "قندورة سوداء بتطريز ذهبي",
    "قنادر",
    3900,
    "قندورة سوداء أنيقة مزينة بخطوط وتفاصيل ذهبية عند الياقة والأكمام.",
    "3900 d a.JPG"
  ),
  siteProduct(
    "عباية بنقشة نباتية بألوان طبيعية",
    "عبايات",
    3900,
    "عباية مفتوحة بنقشة نباتية بألوان الأخضر والبيج، مع قصة انسيابية واسعة.",
    "3900(3).jpg"
  ),
  siteProduct(
    "طقم بني بنقشة خريفية",
    "قنادر",
    3900,
    "طقم مريح بدرجات البني والبرتقالي مع نقشة زخرفية وقصة عملية.",
    "3900d.JPG"
  ),
  siteProduct(
    "عباية بلون تركوازي مع طبقة مزخرفة",
    "عبايات",
    3900,
    "عباية تركوازية طويلة تعلوها طبقة مزخرفة بالبرتقالي، بتصميم يجمع الألوان التقليدية.",
    "3900da.JPG"
  ),
  siteProduct(
    "عباية زرقاء بطبعة زهرية ملونة",
    "عبايات",
    3900,
    "عباية زرقاء طويلة مزينة بطبعة زهرية متعددة الألوان على الأكمام والواجهة.",
    "3900Ï»Ï¼.JPG"
  ),
  siteProduct(
    "عباية بيج بتفاصيل خضراء على الأكمام",
    "عبايات",
    4900,
    "عباية مفتوحة بلون بيج هادئ مع لمسات خضراء على الأكمام والحواف.",
    "40184E57-09BE-47A0-A865-26B8AE5DD508.JPG"
  ),
  siteProduct(
    "قندورة بيج بياقة وتفاصيل سوداء",
    "قنادر",
    4500,
    "قندورة بلون بيج فاتح بتطريز داكن عند الياقة والأكمام، بتصميم بسيط وأنيق.",
    "4500.JPG"
  ),
  siteProduct(
    "قندورة سوداء بتطريز ملون",
    "قنادر",
    4500,
    "قندورة سوداء فضفاضة مطرزة بألوان زاهية حول الياقة لإطلالة تقليدية مميزة.",
    "4500daa (2).jpg"
  ),
  siteProduct(
    "قندورة بنفسجية بتفاصيل ذهبية",
    "قنادر",
    4500,
    "قندورة بنفسجية طويلة مع تطريز ذهبي ناعم على الواجهة والأكمام.",
    "4500daa.JPG"
  ),
  siteProduct(
    "فستان بني طويل بياقة عالية",
    "قنادر",
    3000,
    "فستان بني طويل بقصة مريحة وياقة عالية وأكمام طويلة لإطلالة يومية محتشمة.",
    "47c8724c-422f-4ae8-897c-231f9348c6f9.JPG"
  ),
  siteProduct(
    "عباية بنية بتطريز على الأكمام",
    "عبايات",
    4600,
    "عباية مفتوحة بدرجات البني مزينة بتطريز زخرفي على الأكمام والجيوب، بسعر العرض.",
    "4900 promo 4600.jpg"
  ),
  siteProduct(
    "عباية بيج بتفاصيل ذهبية",
    "عبايات",
    4600,
    "عباية أنيقة بلون بيج مع حواف وتفاصيل ذهبية على الأكمام والجيوب، بسعر العرض.",
    "4900 promo 4600da.jpg"
  ),
  siteProduct(
    "عباية سوداء بأساور بيضاء",
    "عبايات",
    4500,
    "عباية سوداء طويلة بتصميم بسيط وأساور بلون فاتح تضيف تبايناً أنيقاً.",
    "581e15a5-29cf-45bb-966e-2e02c746382a.JPG"
  ),
  siteProduct(
    "قندورة حمراء بتطريز أزرق وذهبي",
    "قنادر",
    3800,
    "قندورة حمراء مزينة بتطريز تقليدي أزرق وذهبي على الصدر والواجهة.",
    "att.5Z6n6O74e5NdN8tjz7wCuttnHG3z0ysRBCrPZfpvwl4.JPG"
  ),
  siteProduct(
    "قندورة بنفسجية بتطريز فاتح",
    "قنادر",
    4500,
    "قندورة بنفسجية واسعة بتفاصيل فاتحة على الواجهة والأكمام لإطلالة أنيقة.",
    "att.auGPjukPd1sreQTspspefo1ZmNnCvvkgkDfjivATNOc.JPG"
  ),
  siteProduct(
    "عباية بيج بلمسات ذهبية على الأكمام",
    "عبايات",
    4900,
    "عباية مفتوحة بلون بيج دافئ مع تطريز ذهبي على الأساور والجيوب.",
    "C5422E22-48F5-4E2D-A25D-3673A5046A01.JPG"
  ),
  siteProduct(
    "فستان مخملي عنابي بتفصيل جانبي",
    "قنادر",
    3500,
    "فستان مخملي بلون عنابي غني مع تفصيل أنيق على الصدر وقصة تبرز جمال التصميم.",
    "IMG_0189.jpg"
  ),
  siteProduct(
    "فستان مخملي أزرق ملكي",
    "قنادر",
    3500,
    "فستان مخملي أزرق ملكي بقصة أنيقة وتفاصيل ناعمة على الصدر.",
    "IMG_0194.jpg"
  ),
  siteProduct(
    "فستان مخملي أخضر داكن",
    "قنادر",
    3500,
    "فستان مخملي أخضر داكن بقصة أنثوية أنيقة ولمسة لامعة.",
    "IMG_0206.jpg"
  ),
  siteProduct(
    "قندورة بيج بأكمام عنابية",
    "قنادر",
    4800,
    "قندورة بيج بتطريز ذهبي وأساور من القطيفة العنابية لإطلالة تقليدية راقية.",
    "IMG_2621.JPG"
  ),
  siteProduct(
    "قندورة بيج بتطريز ذهبي وعنابي",
    "قنادر",
    4800,
    "قندورة فاتحة مزينة بتطريز ذهبي وأساور عنابية من القطيفة.",
    "IMG_2626.JPG"
  ),
  siteProduct(
    "قندورة بيج بأساور قطيفة عنابية",
    "قنادر",
    4800,
    "قندورة واسعة بلون بيج هادئ مع أساور عنابية وتفاصيل مطرزة عند الصدر.",
    "IMG_2628.JPG"
  ),
  siteProduct(
    "قندورة بيج بتطريز تقليدي",
    "قنادر",
    4800,
    "قندورة بيج طويلة بتطريز تقليدي وأساور داكنة تضيف لمسة فاخرة.",
    "IMG_2632.JPG"
  ),
  siteProduct(
    "عباية سوداء بتطريز ذهبي على الياقة",
    "عبايات",
    3900,
    "عباية سوداء طويلة بتفاصيل ذهبية حول الياقة والواجهة، بقصة واسعة وأنيقة.",
    "IMG_2644.JPG"
  ),
  siteProduct(
    "عباية سوداء بتطريز ذهبي مزخرف",
    "عبايات",
    4500,
    "عباية سوداء مزينة بتطريز ذهبي هندسي على الياقة والأكمام.",
    "IMG_2818.jpg",
    ["IMG_2819.jpg"]
  ),
  siteProduct(
    "طقم فوشيا أنيق بقصة واسعة",
    "قنادر",
    3900,
    "طقم فوشيا مريح بقصة واسعة وتفاصيل ناعمة لإطلالة أنثوية مميزة.",
    "IMG_3888.jpg"
  ),
  siteProduct(
    "طقم أسود بتفاصيل ذهبية",
    "قنادر",
    3900,
    "طقم أسود أنيق مع لمسات ذهبية على الواجهة، مناسب للمناسبات والإطلالات المسائية.",
    "IMG_3890.jpg"
  ),
  siteProduct(
    "قندورة ملونة بطبعة هندسية",
    "قنادر",
    3000,
    "قندورة خفيفة بطبعة هندسية نابضة بالألوان وقصة واسعة ومريحة.",
    "IMG_5294.jpg"
  ),
  siteProduct(
    "قندورة بيضاء بنقشة أوراق خضراء",
    "قنادر",
    3000,
    "قندورة بيضاء مريحة مزينة بنقشة أوراق خضراء لإطلالة صيفية منعشة.",
    "IMG_5295.jpg"
  ),
  siteProduct(
    "عباية بنية بتطريز عنابي",
    "عبايات",
    4500,
    "عباية بلون بني هادئ مع تطريز عنابي على الأساور والجيوب.",
    "IMG_5951.jpg"
  ),
  siteProduct(
    "عباية بيج منقوشة بطبقة داخلية",
    "عبايات",
    4900,
    "عباية بيج أنيقة بطبقة خارجية منقوشة وتنسيق متناسق مع فستان داخلي.",
    "IMG_5962.JPG"
  ),
  siteProduct(
    "عباية بيج مزخرفة بقصة انسيابية",
    "عبايات",
    4900,
    "عباية طويلة بلون بيج مع زخارف ناعمة وقصة واسعة مناسبة للمناسبات.",
    "IMG_5968.JPG"
  ),
  siteProduct(
    "قندورة زرقاء بطبقة خارجية زهرية",
    "قنادر",
    3900,
    "قندورة زرقاء مع طبقة خارجية خفيفة مزينة بطبعة زهرية ملونة.",
    "IMG_5970.JPG"
  ),
  siteProduct(
    "طقم بني بنقشة زخرفية",
    "قنادر",
    3900,
    "طقم بلون بني دافئ مع نقشة زخرفية وقصة عملية مريحة.",
    "IMG_5988.JPG"
  ),
  siteProduct(
    "قندورة زرقاء بتطريز أبيض",
    "قنادر",
    4500,
    "قندورة زرقاء ملكية واسعة مع تطريز أبيض أنيق حول الياقة.",
    "IMG_8243.jpg"
  ),
  siteProduct(
    "قندورة سوداء بتطريز ملون",
    "قنادر",
    4500,
    "قندورة سوداء فضفاضة بتطريز ملون على الصدر، تجمع بين الراحة والطابع التقليدي.",
    "IMG_8259.jpg"
  ),
  siteProduct(
    "عباية وردية مطرزة على الأكمام",
    "عبايات",
    4500,
    "عباية وردية طويلة مع تطريز زخرفي على الأساور، بتصميم محتشم وأنيق.",
    "IMG_8307.jpg"
  ),
  siteProduct(
    "عباية بيج بتفاصيل ذهبية",
    "عبايات",
    4900,
    "عباية بلون بيج فاتح مزينة بتطريز ذهبي على الأساور والجيوب.",
    "IMG_8470.jpg"
  ),
  siteProduct(
    "طقم بني مريح بقميص وبنطال",
    "قنادر",
    3500,
    "طقم بلون بني دافئ يتكون من بلوزة طويلة وبنطال متناسق، مناسب للإطلالات اليومية.",
    "IMG_9954.jpg"
  ),
];

async function seedProducts() {
  await requireOwner();

  try {
    const publicDirectory = path.join(process.cwd(), "public");
    const siteDirectory = path.join(publicDirectory, "Site");
    const imageFileNames = fs
      .readdirSync(siteDirectory, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() && /\.(?:jpe?g|png|webp|gif)$/i.test(entry.name)
      )
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
    const productsByFileName = new Map(
      INITIAL_PRODUCTS.flatMap((item) =>
        item.possibleFiles.map((filePath) => [path.basename(filePath), item] as const)
      )
    );
    const mappedFileNames = INITIAL_PRODUCTS.flatMap((item) =>
      item.possibleFiles.map((filePath) => path.basename(filePath))
    );
    const duplicateMappings = mappedFileNames.filter(
      (fileName, index) => mappedFileNames.indexOf(fileName) !== index
    );
    const imageFileNameSet = new Set(imageFileNames);
    const missingProducts = imageFileNames.filter(
      (fileName) => !productsByFileName.has(fileName)
    );
    const missingImages = [...productsByFileName.keys()].filter(
      (fileName) => !imageFileNameSet.has(fileName)
    );

    if (
      INITIAL_PRODUCTS.length !== 57 ||
      duplicateMappings.length ||
      missingProducts.length ||
      missingImages.length
    ) {
      throw new Error(
        `Seed catalog must contain exactly 57 products with a unique mapping for every public/Site image. Duplicate mappings: ${duplicateMappings.join(", ") || "none"}. Missing product details: ${missingProducts.join(", ") || "none"}. Missing image files: ${missingImages.join(", ") || "none"}.`
      );
    }

    const productsToCreate: ProductToCreate[] = [];
    for (const item of INITIAL_PRODUCTS) {
      const imageUrls = await Promise.all(
        item.possibleFiles.map(async (relativeFilePath) => {
          const filePath = path.join(publicDirectory, relativeFilePath);
          const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: "nayo-products",
          });
          return uploadResult.secure_url;
        })
      );

      productsToCreate.push({
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        imageUrl: imageUrls[0],
        images: JSON.stringify(imageUrls),
        size: item.size,
      });
    }

    await db.$transaction(async (transaction) => {
      await transaction.product.deleteMany();
      await transaction.product.createMany({ data: productsToCreate });
    });

    return NextResponse.json({
      success: true,
      message: `Replaced the product catalog with ${productsToCreate.length} products using ${imageFileNames.length} images from public/Site.`,
      productCount: productsToCreate.length,
      imageCount: imageFileNames.length,
    });
  } catch (error: unknown) {
    console.error("Seed Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

function isProductionRequest() {
  return process.env.NODE_ENV === "production"
    ? NextResponse.json(
        { success: false, error: "Product seeding is disabled in production." },
        { status: 403 }
      )
    : null;
}

export async function GET() {
  const productionResponse = isProductionRequest();
  return productionResponse ?? seedProducts();
}

export async function POST() {
  const productionResponse = isProductionRequest();
  return productionResponse ?? seedProducts();
}