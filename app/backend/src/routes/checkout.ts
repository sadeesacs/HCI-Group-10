import { Router } from "express";
import { createCheckout, getOrder } from "../controllers/checkoutController";

const router = Router();

router.get("/:orderNumber", getOrder);
router.post("/", createCheckout);

export default router;