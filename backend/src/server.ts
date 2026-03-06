import express from "express"
import "dotenv/config";
import cors from "cors";

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.listen(port, () => {
    console.log(`Server started at port: ${port}`)
})