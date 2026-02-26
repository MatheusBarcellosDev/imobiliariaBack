"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const neighborhoods_controller_1 = require("../controllers/neighborhoods.controller");
const router = (0, express_1.Router)();
router.get("/", neighborhoods_controller_1.getNeighborhoods);
router.get("/:id", neighborhoods_controller_1.getNeighborhoodById);
exports.default = router;
