import express from "express"
import "dotenv/config";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import bookRoute from "./routes/book.route.js";
import bookBorrowRoute from "./routes/bookBorrow.route.js";
import cookieParser from "cookie-parser";


const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser())

app.use(express.json())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/books", bookRoute)
app.use("/api/v1/borrow", bookBorrowRoute)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})