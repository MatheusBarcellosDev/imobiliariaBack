import { Router } from "express";
import { createLead, getLeads, updateLeadStatus } from "../controllers/leads.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public route to capture leads from the landing page
router.post("/", createLead);

// Protected routes (Admin/Agent only)
router.get("/", authMiddleware, getLeads);
router.patch("/:id/status", authMiddleware, updateLeadStatus);

export default router;
