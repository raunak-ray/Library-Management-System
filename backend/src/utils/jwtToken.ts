import jwt from "jsonwebtoken";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET!;

export const generateToken = (userId: string) => {
    return jwt.sign({user: userId}, jwtSecret, {expiresIn: "7d"})
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, jwtSecret)
}

export const storeTokenInCookie = (res: any, token: string) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
}