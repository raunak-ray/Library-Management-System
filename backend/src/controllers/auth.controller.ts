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
      data: newUser[0]
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
      data: user[0]
  });
}

