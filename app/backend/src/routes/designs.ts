import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import { getDesigns, saveDesign, deleteDesign, renameDesign } from "../controllers/designController";

const router = Router();

router.use(verifyToken);

router.get("/", getDesigns);
router.put("/:slotIndex", saveDesign);
router.delete("/:slotIndex", deleteDesign);
router.patch("/:slotIndex/rename", renameDesign);

export default router;
