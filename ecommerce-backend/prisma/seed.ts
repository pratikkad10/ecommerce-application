import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

const isRemoteDb = Boolean(
  connectionString &&
    !connectionString.includes("localhost") &&
    !connectionString.includes("127.0.0.1")
);

const pool = new Pool({
  connectionString,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Colors
  const colorsData = [
    { name: "Obsidian Black", hexCode: "#111111" },
    { name: "Chalk White", hexCode: "#f8f8f8" },
    { name: "Terracotta Rust", hexCode: "#b05322" },
    { name: "Olive Sage", hexCode: "#556b2f" },
    { name: "Midnight Navy", hexCode: "#1a2a3a" },
  ];

  const colors = [];
  for (const c of colorsData) {
    const existing = await prisma.color.findFirst({ where: { name: c.name } });
    if (!existing) {
      colors.push(await prisma.color.create({ data: c }));
    } else {
      colors.push(existing);
    }
  }

  // 2. Seed Sizes
  const sizesData = [{ name: "S" }, { name: "M" }, { name: "L" }, { name: "XL" }];
  const sizes = [];
  for (const s of sizesData) {
    const existing = await prisma.size.findFirst({ where: { name: s.name } });
    if (!existing) {
      sizes.push(await prisma.size.create({ data: s }));
    } else {
      sizes.push(existing);
    }
  }

  // 3. Seed Categories
  const categoriesData = [
    {
      name: "Sneakers",
      slug: "sneakers",
      description: "Premium handcrafted and athletic footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Apparel",
      slug: "apparel",
      description: "Timeless clothing engineered for everyday comfort",
      image: "https://images.unsplash.com/photo-1489987707023-af815b89ebc3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Electronics",
      slug: "electronics",
      description: "Cutting-edge audio, wearables, and tech gear",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Refined bags, wallets, and lifestyle essentials",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = upserted;
  }

  // 4. Seed Active Campaign
  const existingCampaign = await prisma.campaign.findFirst({
    where: { isActive: true },
  });

  if (!existingCampaign) {
    await prisma.campaign.create({
      data: {
        title: "Summer Flash Sale — Up to",
        highlightText: "60% Off",
        subtitle: "Exclusive Markdowns",
        description: "Prices vanish when the timer hits zero. Free express shipping on all orders over ₹999.",
        bannerImageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // 5. Seed Sample Products
  const sampleProducts = [
    {
      name: "Kraya Minimalist Heavyweight Hoodie",
      slug: "kraya-minimalist-heavyweight-hoodie",
      description: "Crafted from 480 GSM organic cotton fleece with tailored drop-shoulder cut.",
      basePrice: 2999,
      brand: "Kraya Studio",
      gender: "UNISEX" as const,
      categoryId: categories["apparel"].id,
      isFeatured: true,
      averageRating: 4.9,
      numReviews: 28,
      images: [
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "AeroPulse Performance Runner Sneakers",
      slug: "aeropulse-performance-runner-sneakers",
      description: "Dual-density responsive foam midsole with breathable recycled knit upper.",
      basePrice: 4499,
      brand: "AeroPulse",
      gender: "UNISEX" as const,
      categoryId: categories["sneakers"].id,
      isFeatured: true,
      averageRating: 4.8,
      numReviews: 42,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "SonicPro Spatial Wireless Headphones",
      slug: "sonicpro-spatial-wireless-headphones",
      description: "40mm custom drivers with hybrid active noise cancellation and 45-hour battery life.",
      basePrice: 7999,
      brand: "SonicPro",
      gender: "UNISEX" as const,
      categoryId: categories["electronics"].id,
      isFeatured: true,
      averageRating: 5.0,
      numReviews: 19,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop",
      ],
    },
    {
      name: "Minimalist Full-Grain Leather Cardholder",
      slug: "minimalist-full-grain-leather-cardholder",
      description: "Hand-stitched Tuscan vegetable-tanned leather with RFID blocking protection.",
      basePrice: 1299,
      brand: "Kraya Leather",
      gender: "UNISEX" as const,
      categoryId: categories["accessories"].id,
      isFeatured: true,
      averageRating: 4.7,
      numReviews: 15,
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
      ],
    },
  ];

  for (const prodData of sampleProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: prodData.slug } });
    if (!existing) {
      const product = await prisma.product.create({
        data: {
          name: prodData.name,
          slug: prodData.slug,
          description: prodData.description,
          basePrice: prodData.basePrice,
          brand: prodData.brand,
          gender: prodData.gender,
          categoryId: prodData.categoryId,
          isFeatured: prodData.isFeatured,
          averageRating: prodData.averageRating,
          numReviews: prodData.numReviews,
          images: {
            create: prodData.images.map((url, index) => ({
              url,
              isPrimary: index === 0,
            })),
          },
        },
      });

      // Create variants for the product
      const variantItems = [
        { sku: `${product.slug}-s-blk`, sizeId: sizes[0]?.id, colorId: colors[0]?.id, stock: 25 },
        { sku: `${product.slug}-m-blk`, sizeId: sizes[1]?.id, colorId: colors[0]?.id, stock: 40 },
        { sku: `${product.slug}-l-blk`, sizeId: sizes[2]?.id, colorId: colors[0]?.id, stock: 30 },
        { sku: `${product.slug}-m-wht`, sizeId: sizes[1]?.id, colorId: colors[1]?.id, stock: 20 },
      ];

      for (const v of variantItems) {
        await prisma.productVariant.create({
          data: {
            sku: v.sku,
            productId: product.id,
            sizeId: v.sizeId,
            colorId: v.colorId,
            stock: v.stock,
            price: prodData.basePrice,
          },
        });
      }
    }
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
