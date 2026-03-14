import express from "express"
import "dotenv/config";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import bookRoute from "./routes/book.route.js";
import bookBorrowRoute from "./routes/bookBorrow.route.js";
import adminRoute from "./routes/admin.route.js";
import activityRoute from "./routes/activity.route.js";
import cookieParser from "cookie-parser";
import path from "path";

const _dirname = path.resolve();


const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        "http://localhost:3000", 
        'https://library-management-system-six-rust.vercel.app'],
    credentials: true
}));
app.use(cookieParser())

app.use(express.json())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/books", bookRoute)
app.use("/api/v1/borrow", bookBorrowRoute)
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/activity", activityRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "../frontend/dist")))
    
    app.get(/.*/, (_, res) => {
        res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"))
    })
}

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})