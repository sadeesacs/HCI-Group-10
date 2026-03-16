import { Response } from "express";
import { Design } from "../models/design";
import type { AuthRequest } from "../middleware/auth";

const MAX_SLOTS = 10;

/** GET /api/designs — fetch all designs for the authenticated user */
export async function getDesigns(req: AuthRequest, res: Response) {
  try {
    const designs = await Design.find({ userId: req.userId }).sort({ slotIndex: 1 });
    return res.json({ designs });
  } catch (error) {
    console.error("getDesigns error", error);
    return res.status(500).json({ message: "Failed to fetch designs" });
  }
}

/** PUT /api/designs/:slotIndex — create or update a design in a slot */
export async function saveDesign(req: AuthRequest, res: Response) {
  try {
    const slotIndex = parseInt(req.params.slotIndex as string, 10);
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= MAX_SLOTS) {
      return res.status(400).json({ message: "Invalid slot index (0-9)" });
    }

    const { name, roomConfig, items } = req.body as {
      name?: string;
      roomConfig?: unknown;
      items?: unknown[];
    };

    if (!name || !roomConfig) {
      return res.status(400).json({ message: "name and roomConfig are required" });
    }

    const design = await Design.findOneAndUpdate(
      { userId: req.userId, slotIndex },
      { name, roomConfig, items: items || [], userId: req.userId, slotIndex },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({ design });
  } catch (error) {
    console.error("saveDesign error", error);
    return res.status(500).json({ message: "Failed to save design" });
  }
}

/** DELETE /api/designs/:slotIndex — delete a design from a slot */
export async function deleteDesign(req: AuthRequest, res: Response) {
  try {
    const slotIndex = parseInt(req.params.slotIndex as string, 10);
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= MAX_SLOTS) {
      return res.status(400).json({ message: "Invalid slot index (0-9)" });
    }

    await Design.findOneAndDelete({ userId: req.userId, slotIndex });
    return res.json({ message: "Design deleted" });
  } catch (error) {
    console.error("deleteDesign error", error);
    return res.status(500).json({ message: "Failed to delete design" });
  }
}

/** PATCH /api/designs/:slotIndex/rename — rename a design */
export async function renameDesign(req: AuthRequest, res: Response) {
  try {
    const slotIndex = parseInt(req.params.slotIndex as string, 10);
    if (isNaN(slotIndex) || slotIndex < 0 || slotIndex >= MAX_SLOTS) {
      return res.status(400).json({ message: "Invalid slot index (0-9)" });
    }

    const { name } = req.body as { name?: string };
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    const design = await Design.findOneAndUpdate(
      { userId: req.userId, slotIndex },
      { name },
      { new: true }
    );

    if (!design) {
      return res.status(404).json({ message: "Design not found" });
    }

    return res.json({ design });
  } catch (error) {
    console.error("renameDesign error", error);
    return res.status(500).json({ message: "Failed to rename design" });
  }
}
