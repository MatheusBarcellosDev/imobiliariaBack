import { Router } from "express";

const router = Router();

// Exemplo de sub-rotas a serem implementadas nas próximas etapas:
import authRoutes from "./auth.routes";
import propertiesRoutes from "./properties.routes";
import leadsRoutes from "./leads.routes";
import neighborhoodsRoutes from "./neighborhoods.routes";
import chatRoutes from "./chat.routes";
import uploadRoutes from "./upload.routes";

router.use("/auth", authRoutes);
router.use("/properties", propertiesRoutes);
router.use("/leads", leadsRoutes);
router.use("/neighborhoods", neighborhoodsRoutes);
router.use("/chat", chatRoutes);
router.use("/upload", uploadRoutes);

export default router;
