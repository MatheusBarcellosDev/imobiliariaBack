"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Exemplo de sub-rotas a serem implementadas nas próximas etapas:
const auth_routes_1 = __importDefault(require("./auth.routes"));
const properties_routes_1 = __importDefault(require("./properties.routes"));
const leads_routes_1 = __importDefault(require("./leads.routes"));
const neighborhoods_routes_1 = __importDefault(require("./neighborhoods.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const upload_routes_1 = __importDefault(require("./upload.routes"));
router.use("/auth", auth_routes_1.default);
router.use("/properties", properties_routes_1.default);
router.use("/leads", leads_routes_1.default);
router.use("/neighborhoods", neighborhoods_routes_1.default);
router.use("/chat", chat_routes_1.default);
router.use("/upload", upload_routes_1.default);
exports.default = router;
