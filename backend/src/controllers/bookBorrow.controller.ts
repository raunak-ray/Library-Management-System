import { Request, Response } from "express";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema/User.js";
import { and, eq } from "drizzle-orm";
import { sendResponse } from "../utils/sendResponse.js";
import { booksTable } from "../db/schema/Book.js";
import { AppError } from "../utils/AppError.js";
import { bookBorrowTable } from "../db/schema/BookBorrow.js";
import { redis } from "../utils/redis.js";

export const bookBorrowController = async (req: Request, res: Response) => {
    const {bookId} = req.params;

    const {userId} = req;

    const user = await db
                    .select()
                    .from(usersTable)
                    .where(eq(usersTable.id, userId as any))
                    .then((res) => res[0]);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const book = await db
                    .select()
                    .from(booksTable)
                    .where(eq(booksTable.id, bookId as any))
                    .then((res) => res[0]);

    if (!book) {
        throw new AppError(404, "Book not found");
    }

    if (book.availableCopies < 1) {
        throw new AppError(400, "No copies available for borrowing");
    }

    const borrowDate = new Date();
    const returnDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const newBorrow =await db.insert(bookBorrowTable)
            .values({
                userId: user.id,
                bookId: book.id,
                borrowDate,
                returnDate,
            })
            .returning()
            .then((res) => res[0]);

    await db.update(booksTable)
            .set({availableCopies: book.availableCopies - 1})
            .where(eq(booksTable.id, book.id));

    await redis.del(`borrowedBooks:${userId}`);

    sendResponse(res, {
        statusCode: 201,
        message: "Book borrowed successfully",
        data: {
            id: newBorrow.id,
            bookTitle: book.title,
            borrowDate,
            returnDate,
        }
    })
}

export const getBorrowedBooksController = async (req: Request, res: Response) => {
    const {userId} = req;

    const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId as any))
            .then((res) => res[0]);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const cachedData = await redis.get(`borrowedBooks:${userId}`);

    if (cachedData) {
        return sendResponse(res, {
            statusCode: 200,
            message: "Borrowed books retrieved successfully (from cache)",
            data: cachedData
        })
    }

    const borrowedBooks = await db
            .select()
            .from(bookBorrowTable)
            .where(eq(bookBorrowTable.userId, userId as any))
            .fullJoin(booksTable, eq(bookBorrowTable.bookId, booksTable.id))

    const responseData = borrowedBooks.map((borrow) => ({
        id: borrow.book_borrow?.id,
        bookTitle: borrow.books?.title,
        author: borrow.books?.author,
        borrowDate: borrow.book_borrow?.borrowDate,
        returnDate: borrow.book_borrow?.returnDate,
    }))

    await redis.set(`borrowedBooks:${userId}`, JSON.stringify(responseData), {ex: 3600});
            
    sendResponse(res, {
        statusCode: 200,
        message: "Borrowed books retrieved successfully",
        data: responseData
    })
}

export const returnBookController = async (req: Request, res: Response) => {
    const {borrowId} = req.params;

    const {userId} = req;

    const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, userId as any))
            .then((res) => res[0]);
    
    if (!user) {
        throw new AppError(404, "User not found");
    }

    const borrowedBook = await db
            .select()
            .from(bookBorrowTable)
            .where(and(eq(bookBorrowTable.id, borrowId as any),
                       eq(bookBorrowTable.userId, userId as any)))
            .then((res) => res[0]);

    console.log(borrowedBook);
    
    
    if (!borrowedBook) {
        throw new AppError(404, "Borrowed book record not found");
    }

    const book = await db
            .select()
            .from(booksTable)
            .where(eq(booksTable.id, borrowedBook.bookId as any))
            .then((res) => res[0]);

    if (!book) {
        throw new AppError(404, "Book not found");
    }

    await db.delete(bookBorrowTable)
            .where(eq(bookBorrowTable.id, borrowedBook.id));
        
    await db.update(booksTable)
            .set({availableCopies: book.availableCopies + 1})
            .where(eq(booksTable.id, book.id));

    await redis.del(`borrowedBooks:${userId}`);

    sendResponse(res, {
        statusCode: 200,
        message: "Book returned successfully",
        data: null
    })
}