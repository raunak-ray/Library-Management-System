import { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { db } from "../db/index.js";
import { usersTable, roleEnum } from "../db/schema/User.js";
import { eq } from "drizzle-orm";
import { sendResponse } from "../utils/sendResponse.js";
import { booksTable } from "../db/schema/Book.js";
import { bookBorrowTable } from "../db/schema/BookBorrow.js";

// Get all users (Admin only)
export const getAllUsersController = async (req: Request, res: Response) => {
  const { userRole } = req;

  if (userRole !== "admin") {
    throw new AppError(403, "Only admins can access this resource");
  }

  const users = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
  })
    .from(usersTable);

  sendResponse(res, {
    statusCode: 200,
    message: "Users retrieved successfully",
    data: users,
  });
};

// Promote user to librarian
export const promoteUserController = async (req: Request, res: Response) => {
  const { userRole } = req;
  const { id } = req.params;

  if (userRole !== "admin") {
    throw new AppError(403, "Only admins can perform this action");
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id as any))
    .then((res) => res[0]);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role === "librarian" || user.role === "admin") {
    throw new AppError(400, "User is already a librarian or admin");
  }

  const updatedUser = await db
    .update(usersTable)
    .set({ role: "librarian" })
    .where(eq(usersTable.id, id as any))
    .returning();

  sendResponse(res, {
    statusCode: 200,
    message: "User promoted to librarian successfully",
    data: {
      id: updatedUser[0].id,
      name: updatedUser[0].name,
      email: updatedUser[0].email,
      role: updatedUser[0].role,
    },
  });
};

// Revoke librarian access
export const revokeUserController = async (req: Request, res: Response) => {
  const { userRole } = req;
  const { id } = req.params;

  if (userRole !== "admin") {
    throw new AppError(403, "Only admins can perform this action");
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id as any))
    .then((res) => res[0]);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role !== "librarian") {
    throw new AppError(400, "User is not a librarian");
  }

  const updatedUser = await db
    .update(usersTable)
    .set({ role: "student" })
    .where(eq(usersTable.id, id as any))
    .returning();

  sendResponse(res, {
    statusCode: 200,
    message: "User revoked to student successfully",
    data: {
      id: updatedUser[0].id,
      name: updatedUser[0].name,
      email: updatedUser[0].email,
      role: updatedUser[0].role,
    },
  });
};

// Get admin statistics
export const getAdminStatsController = async (req: Request, res: Response) => {
  const { userRole } = req;

  if (userRole !== "admin") {
    throw new AppError(403, "Only admins can access this resource");
  }

  // Total users count
  const totalUsers = await db.select()
    .from(usersTable)
    .then((res) => res.length);

  // Total books count
  const totalBooks = await db.select()
    .from(booksTable)
    .then((res) => res.length);

  // Books statistics
  const books = await db.select().from(booksTable);
  const borrowedBooks = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0);
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);

  // Users by role
  const usersData = await db.select().from(usersTable);
  const usersByRole = {
    student: usersData.filter((u) => u.role === "student").length,
    librarian: usersData.filter((u) => u.role === "librarian").length,
    admin: usersData.filter((u) => u.role === "admin").length,
  };

  // Books by category
  const booksByCategory = await db.select().from(booksTable).then((books) => {
    const categories: Record<string, number> = {};
    books.forEach((book) => {
      categories[book.category] = (categories[book.category] || 0) + 1;
    });
    return Object.entries(categories).map(([category, count]) => ({
      category,
      count,
    }));
  });

  // Borrow trend (last 7 days)
  const borrowRecords = await db.select().from(bookBorrowTable);
  const borrowTrend: Record<string, number> = {};
  
  borrowRecords.forEach((record) => {
    const date = new Date(record.borrowDate).toISOString().split("T")[0];
    borrowTrend[date] = (borrowTrend[date] || 0) + 1;
  });

  const borrowTrendArray = Object.entries(borrowTrend)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30);

  sendResponse(res, {
    statusCode: 200,
    message: "Admin statistics retrieved successfully",
    data: {
      totalUsers,
      totalBooks,
      borrowedBooks,
      availableBooks,
      usersByRole,
      booksByCategory,
      borrowTrend: borrowTrendArray,
    },
  });
};
