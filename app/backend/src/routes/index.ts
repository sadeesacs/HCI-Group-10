import { Router } from "express";
import productRoutes from "./products";
import authRoutes from "./auth";
import checkoutRoutes from "./checkout";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

router.use("/products", productRoutes);
router.use("/auth", authRoutes);
router.use("/checkout", checkoutRoutes);

export default router;
