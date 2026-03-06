import express from "express"
import "dotenv/config";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoute from "./routes/auth.route.js";
import cookieParser from "cookie-parser";


const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(cookieParser())

app.use(express.json())

app.use("/api/v1/auth", authRoute)

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})