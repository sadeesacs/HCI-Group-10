import { Router } from "express";
import productRoutes from "./products";
import authRoutes from "./auth";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

router.use("/products", productRoutes);
router.use("/auth", authRoutes);

export default router;
