import { Router } from "express";
import productRoutes from "./products";
import authRoutes from "./auth";
import checkoutRoutes from "./checkout";
import contactRoutes from "./contact";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API is healthy" });
});

router.use("/products", productRoutes);
router.use("/auth", authRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/contact", contactRoutes);

export default router;
