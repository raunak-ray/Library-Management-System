import { Response } from "express"

interface responseType {
    statusCode: number,
    message: string,
    data: object
}

export const sendResponse = (res: Response, 
    {statusCode, message, data}: responseType) => {
        return res.status(statusCode).json({
            message: message || "Success",
            success: true,
            data: data || null,
        })
}