import { Request, Response } from "express";
import { Order, type PaymentMethod } from "../models/order";
import { Product } from "../models/product";

type CheckoutItemInput = {
  productId: string;
  quantity: number;
  selectedColor?: string;
};

const DELIVERY_FEE = 1500;

function validatePaymentMethod(method: unknown): method is PaymentMethod {
  return method === "cash-on-delivery" || method === "online-mock";
}

function generateOrderNumber() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `CC${y}${m}${d}-${rand}`;
}

export async function createCheckout(req: Request, res: Response) {
  try {
    const {
      customer,
      shippingAddress,
      items,
      paymentMethod,
    } = req.body as {
      customer?: { name?: string; email?: string; phone?: string };
      shippingAddress?: { line1?: string; city?: string; postalCode?: string };
      items?: CheckoutItemInput[];
      paymentMethod?: PaymentMethod;
    };

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ message: "Customer name, email, and phone are required" });
    }

    if (!shippingAddress?.line1 || !shippingAddress?.city || !shippingAddress?.postalCode) {
      return res.status(400).json({ message: "Shipping address is incomplete" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one item is required" });
    }

    if (!validatePaymentMethod(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p.id.toString(), p]));

    const orderItems = items.map((i) => {
      const product = productMap.get(i.productId);
      if (!product) {
        throw new Error(`Product not found: ${i.productId}`);
      }
      const qty = Math.max(1, Number(i.quantity) || 1);
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        selectedColor: i.selectedColor,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        line1: shippingAddress.line1.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
      },
      items: orderItems,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod,
      status: paymentMethod === "online-mock" ? "paid" : "placed",
    });

    return res.status(201).json({
      order,
      message: paymentMethod === "online-mock" ? "Payment captured (mock)" : "Order placed",
    });
  } catch (error) {
    console.error("Checkout error", error);
    const message = error instanceof Error ? error.message : "Failed to place order";
    if (message.startsWith("Product not found")) {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message: "Failed to place order" });
  }
}