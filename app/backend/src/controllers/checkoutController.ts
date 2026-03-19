import { Request, Response } from "express";
import { Order, type PaymentMethod } from "../models/order";
import { Product } from "../models/product";

type CheckoutItemInput = {
  productId: string;
  quantity: number;
  selectedColor?: string;
};

const DELIVERY_FEE = 1500;
const PHONE_PATTERN = /^\d{10}$/;

function validatePaymentMethod(method: unknown): method is PaymentMethod {
  return method === "cash-on-delivery" || method === "online-mock";
}

function generateOrderNumber() {
  // 8-digit numeric string
  const n = Math.floor(10000000 + Math.random() * 90000000);
  return String(n);
}

export async function createCheckout(req: Request, res: Response) {
  try {
    const {
      customer,
      shippingAddress,
      items,
      paymentMethod,
      userId,
    } = req.body as {
      customer?: { name?: string; email?: string; phone?: string };
      shippingAddress?: {
        line1?: string;
        line2?: string;
        city?: string;
        postalCode?: string;
        notes?: string;
        location?: { lat?: number; lng?: number };
      };
      items?: CheckoutItemInput[];
      paymentMethod?: PaymentMethod;
      userId?: string;
    };

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ message: "Customer name, email, and phone are required" });
    }

    const trimmedPhone = customer.phone.trim();
    if (!PHONE_PATTERN.test(trimmedPhone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    if (
      !shippingAddress?.line1 ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode ||
      shippingAddress?.location?.lat === undefined ||
      shippingAddress?.location?.lng === undefined
    ) {
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
        phone: trimmedPhone,
      },
      shippingAddress: {
        line1: shippingAddress.line1.trim(),
        line2: shippingAddress.line2?.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        notes: shippingAddress.notes?.trim(),
        location: {
          lat: Number(shippingAddress.location.lat),
          lng: Number(shippingAddress.location.lng),
        },
      },
      items: orderItems,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentMethod,
      status: paymentMethod === "online-mock" ? "paid" : "placed",
      userId: userId || undefined,
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

export async function getOrder(req: Request, res: Response) {
  try {
    const { orderNumber } = req.params;
    if (!orderNumber) {
      return res.status(400).json({ message: "Order number is required" });
    }

    const order = await Order.findOne({ orderNumber }).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ order });
  } catch (error) {
    console.error("Fetch order error", error);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
}