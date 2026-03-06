import express from "express";
import { protectRoutes } from "../middlewares/auth.js";
import { createBookController } from "../controllers/book.controller.js";

const router = express.Router();

router.use(protectRoutes);

router.post("/", createBookController);

export default router;