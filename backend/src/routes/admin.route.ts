import express from "express";
import {
  getAllUsersController,
  promoteUserController,
  revokeUserController,
  getAdminStatsController,
} from "../controllers/admin.controller.js";
import { protectRoutes } from "../middlewares/auth.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/users", getAllUsersController);
router.patch("/users/:id/promote", promoteUserController);
router.patch("/users/:id/revoke", revokeUserController);
router.get("/stats", getAdminStatsController);

export default router;
