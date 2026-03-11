import express from "express";
import { getActivityController } from "../controllers/activity.controller.js";
import { protectRoutes } from "../middlewares/auth.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/", getActivityController);

export default router;
