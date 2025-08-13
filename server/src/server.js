import express from "express";
import 'dotenv/config';
import connectDb from "./config/connectDB.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDb();
});