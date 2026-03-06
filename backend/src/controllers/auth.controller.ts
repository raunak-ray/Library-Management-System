import { Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { db } from "../db/index.js";
import { usersTable } from "../db/schema/User.js";
import { eq } from "drizzle-orm";
import { sendResponse } from "../utils/sendResponse.js";
import bcrypt from "bcrypt";
import { generateToken, storeTokenInCookie } from "../utils/jwtToken.js";

export const signupController = async (req: Request, res: Response) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
      throw new AppError(400, "All fields are required");
  }

  email = email.trim().toLowerCase();
  name = name.trim();
  password = password.trim();


  const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

  if (existingUser.length > 0) {
      throw new AppError(409, "User already exists");
  }

  if (password.length < 8) {
    throw new AppError(400, "Password must be at least 8 characters long");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning();

  const token = generateToken(newUser[0].id);

  storeTokenInCookie(res, token);

  sendResponse(res, {
      statusCode: 201,
      message: "User created successfully",
      data: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        role: newUser[0].role
      }
  });
};

export const loginController = async (req: Request, res: Response) => {
  let {email, password} = req.body;

  if (!email || !password) {
      throw new AppError(400, "All fields are required");
  }

  email = email.trim().toLowerCase();
  password = password.trim();

  if (password.length < 8) { 
    throw new AppError(400, "Password must be at least 8 characters long");
  }

  const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

  if (user.length === 0) {
      throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user[0].password);

  if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken(user[0].id);

  storeTokenInCookie(res, token);

  sendResponse(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
  });
}

export const fetchMe = async (req: Request, res: Response) => {
  const {userId} = req;

  if (!userId) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

  if (user.length === 0) {
      throw new AppError(404, "User not found");
  }

  sendResponse(res, {
      statusCode: 200,
      message: "User fetched successfully",
      data: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
  });
}

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  sendResponse(res, {
    statusCode: 200,
    message: "Logout successful",
    data: {}
  })
}