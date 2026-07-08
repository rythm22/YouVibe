import { Router } from "express";
import { authCallback } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/callback", authCallback)

export default authRouter;