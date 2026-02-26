"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const properties_controller_1 = require("../controllers/properties.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", properties_controller_1.getProperties);
router.get("/:id", properties_controller_1.getPropertyById);
// Protected routes (Admin/Agent only)
router.post("/", auth_middleware_1.authMiddleware, properties_controller_1.createProperty);
router.put("/:id", auth_middleware_1.authMiddleware, properties_controller_1.updateProperty);
router.delete("/:id", auth_middleware_1.authMiddleware, properties_controller_1.deleteProperty);
exports.default = router;
