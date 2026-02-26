import { Router } from "express";
import { getNeighborhoods, getNeighborhoodById } from "../controllers/neighborhoods.controller";

const router = Router();

router.get("/", getNeighborhoods);
router.get("/:id", getNeighborhoodById);

export default router;
