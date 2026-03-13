import { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema/User.js";
import { eq } from "drizzle-orm";
import { sendResponse } from "../utils/sendResponse.js";
import { bookBorrowTable } from "../db/schema/BookBorrow.js";
import { booksTable } from "../db/schema/Book.js";
import { redis } from "../utils/redis.js";

export const getActivityController = async (req: Request, res: Response) => {
  const { userId, userRole } = req;

  if (userRole !== "student") {
    throw new AppError(403, "Only students can access this resource");
  }

  // Check Redis cache first
  const cachedActivity = await redis.get(`activity:${userId}`);

  if (cachedActivity) {
    return sendResponse(res, {
      statusCode: 200,
      message: "Activity retrieved successfully (from cache)",
      data: cachedActivity,
    });
  }

  // Get user's borrow history
  const borrowRecords = await db
    .select({
      id: bookBorrowTable.id,
      borrowDate: bookBorrowTable.borrowDate,
      returnDate: bookBorrowTable.returnDate,
      bookTitle: booksTable.title,
    })
    .from(bookBorrowTable)
    .innerJoin(booksTable, eq(bookBorrowTable.bookId, booksTable.id))
    .where(eq(bookBorrowTable.userId, userId as any));

  // Format activity data
  const activity = borrowRecords.map((record) => {
    const action = record.returnDate ? "returned" : "borrowed";
    const date = record.returnDate || record.borrowDate;

    return {
      id: record.id,
      bookTitle: record.bookTitle,
      action,
      date: new Date(date).toISOString().split("T")[0],
    };
  });

  // Sort by date (newest first)
  activity.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Cache for 1 hour (3600 seconds)
  await redis.setex(
    `activity:${userId}`,
    3600,
    JSON.stringify(activity)
  );

  sendResponse(res, {
    statusCode: 200,
    message: "Activity retrieved successfully",
    data: activity,
  });
};
