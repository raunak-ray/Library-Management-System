import express from "express";
import { protectRoutes } from "../middlewares/auth.js";
import { createBookController, deleteBookController, getBooksController } from "../controllers/book.controller.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/", getBooksController)
router.post("/", createBookController);
router.delete("/:id", deleteBookController);

export default router;