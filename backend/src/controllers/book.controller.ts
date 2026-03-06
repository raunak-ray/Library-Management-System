import { Request, Response } from "express";
import { db } from "../db/index.js";
import { booksTable } from "../db/schema/Book.js";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/AppError.js";
import { sendResponse } from "../utils/sendResponse.js";

export const createBookController = async (req: Request, res: Response) => {
    const { title, author, category, description, totalCopies } = req.body;

    if (!title || !author || !category || !description || !totalCopies) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const validCategories = [
        "fiction",
        "non-fiction",
        "technology",
        "science",
        "history",
        "biography",
        "architecture",
        "medical",
        "law",
        "business",
        "philosophy",
        "education"
    ];

    if (!validCategories.includes(category)) {
        throw new AppError(400, `Invalid category. Allowed: ${validCategories.join(", ")}`);
    }

    const { userRole } = req;

    if (userRole !== "admin" && userRole !== "librarian") {
        throw new AppError(403, "Only admin and librarian can create books");
    }

    const existingBook = await db
        .select()
        .from(booksTable)
        .where(eq(booksTable.title, title))
        .then(result => result[0]);

    if (existingBook) {
        throw new AppError(400, "Book with this title already exists");
    }

    const newBook = await db
        .insert(booksTable)
        .values({
            title,
            author,
            category,
            description,
            totalCopies,
            availableCopies: totalCopies
        })
        .returning()
        .then(result => result[0]);

    sendResponse(res, {
        statusCode: 201,
        message: "Book created successfully",
        data: newBook
    });
};