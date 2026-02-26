import { Router } from "express";
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty } from "../controllers/properties.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", getProperties);
router.get("/:id", getPropertyById);

// Protected routes (Admin/Agent only)
router.post("/", authMiddleware, createProperty);
router.put("/:id", authMiddleware, updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);

export default router;
