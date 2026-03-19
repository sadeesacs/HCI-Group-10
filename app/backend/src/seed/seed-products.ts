import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Product } from "../models/product";
import { baseProducts, baseProductExtras } from "./data/base-products";
import { bedProducts, bedProductExtras } from "./data/bed-products";
import { chairProducts, chairProductExtras } from "./data/chair-products";
import { sofaProducts, sofaProductExtras } from "./data/sofa-products";
import { diningProducts, diningProductExtras } from "./data/dining-products";
import { storageProducts, storageProductExtras } from "./data/storage-products";
import { ProductExtras } from "./types";

const allProducts = [
  ...baseProducts,
  ...diningProducts,
  ...sofaProducts,
  ...bedProducts,
  ...chairProducts,
  ...storageProducts,
];

const extras: ProductExtras = {
  ...baseProductExtras,
  ...diningProductExtras,
  ...sofaProductExtras,
  ...bedProductExtras,
  ...chairProductExtras,
  ...storageProductExtras,
};

function normalizeProduct(p: (typeof allProducts)[number]) {
  const extra = extras[p.id] ?? {};
  return {
    name: p.name,
    price: p.price,
    category: p.category,
    tag: p.tag,
    description: p.description,
    colors: p.colors ?? [],
    images: p.images ?? [],
    isNew: Boolean(p.isNew),
    popularity: p.popularity ?? 0,
    longDescription: extra.longDescription ?? p.longDescription,
    dimensions: extra.dimensions ?? p.dimensions,
    materials: extra.materials ?? p.materials ?? [],
  };
}

async function seed() {
  await connectDB();

  console.log(`Seeding ${allProducts.length} products...`);
  await Product.deleteMany({});
  const docs = allProducts.map((p) => normalizeProduct(p));
  await Product.insertMany(docs);
  console.log("Seeding complete.");
}

seed()
  .catch((err) => {
    console.error("Seed failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
