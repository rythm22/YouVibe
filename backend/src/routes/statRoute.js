import { Router } from "express";
import { getStats } from "../controllers/statsControllers.js";
import { protectRoute, requireAdmin } from "../middleware/authMiddleware.js";

const statRouter = Router();

statRouter.get('/', protectRoute, requireAdmin, getStats);

export default statRouter;