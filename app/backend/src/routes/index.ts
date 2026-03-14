import { Router } from "express";
import productRoutes from "./products";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

router.use("/products", productRoutes);

export default router;
