import { Request, Response } from "express";
import { Contact } from "../models/contact";

const NAME_PATTERN = /^[A-Za-z ]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10}$/;

export async function createContact(req: Request, res: Response) {
  try {
    const { name, email, phone, subject, message } = req.body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };

    const trimmedName = name?.trim() || "";
    const trimmedEmail = email?.trim() || "";
    const trimmedPhone = phone?.trim() || "";
    const trimmedSubject = subject?.trim() || "";
    const trimmedMessage = message?.trim() || "";

    if (!trimmedName || !NAME_PATTERN.test(trimmedName)) {
      return res.status(400).json({ message: "Please provide a valid name" });
    }

    if (!trimmedEmail || !EMAIL_PATTERN.test(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    if (!trimmedPhone || !PHONE_PATTERN.test(trimmedPhone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    if (!trimmedSubject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters" });
    }

    const contact = await Contact.create({
      name: trimmedName,
      email: trimmedEmail.toLowerCase(),
      phone: trimmedPhone,
      subject: trimmedSubject,
      message: trimmedMessage,
    });

    return res.status(201).json({ message: "Message received", contact });
  } catch (error) {
    console.error("Contact submission error", error);
    return res.status(500).json({ message: "Failed to submit message" });
  }
}
