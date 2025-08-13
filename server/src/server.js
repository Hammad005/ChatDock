import express from "express";
import 'dotenv/config';
import connectDb from "./config/connectDB.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from "./routes/authRoute.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({
    limit: '500mb'
}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use('/api/auth', authRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDb();
});