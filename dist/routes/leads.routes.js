"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leads_controller_1 = require("../controllers/leads.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public route to capture leads from the landing page
router.post("/", leads_controller_1.createLead);
// Protected routes (Admin/Agent only)
router.get("/", auth_middleware_1.authMiddleware, leads_controller_1.getLeads);
router.patch("/:id/status", auth_middleware_1.authMiddleware, leads_controller_1.updateLeadStatus);
exports.default = router;
