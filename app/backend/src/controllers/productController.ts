import { Request, Response } from "express";
import { Product } from "../models/product";

export async function listProducts(req: Request, res: Response) {
  const { search, category, minPrice, maxPrice, sort } = req.query;

  const filter: Record<string, unknown> = {};
  if (typeof search === "string" && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  if (typeof category === "string" && category.trim()) {
    filter.category = category.trim();
  }

  const priceFilters: Record<string, number> = {};
  const min = typeof minPrice === "string" ? Number(minPrice) : undefined;
  const max = typeof maxPrice === "string" ? Number(maxPrice) : undefined;
  if (typeof min === "number" && !Number.isNaN(min)) priceFilters.$gte = min;
  if (typeof max === "number" && !Number.isNaN(max)) priceFilters.$lte = max;
  if (Object.keys(priceFilters).length) {
    filter.price = priceFilters;
  }

  let query = Product.find(filter);

  switch (sort) {
    case "price-asc":
      query = query.sort({ price: 1 });
      break;
    case "price-desc":
      query = query.sort({ price: -1 });
      break;
    case "new":
      query = query.sort({ isNew: -1, createdAt: -1 });
      break;
    case "popular":
    default:
      query = query.sort({ popularity: -1, createdAt: -1 });
      break;
  }

  const products = await query.exec();
  res.json(products);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
}
