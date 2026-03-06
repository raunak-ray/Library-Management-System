import express from "express";
import { protectRoutes } from "../middlewares/auth.js";
import { createBookController, getBooksController } from "../controllers/book.controller.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/", getBooksController)
router.post("/", createBookController);

export default router;