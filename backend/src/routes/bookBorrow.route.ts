import express from "express";
import { protectRoutes } from "../middlewares/auth.js";
import { bookBorrowController, getBorrowedBooksController, returnBookController } from "../controllers/bookBorrow.controller.js";

const router = express.Router();

router.use(protectRoutes);

router.get("/", getBorrowedBooksController);
router.post("/:bookId", bookBorrowController);
router.post("/return/:borrowId", returnBookController);

export default router;