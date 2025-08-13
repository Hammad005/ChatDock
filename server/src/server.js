import express from "express";
import 'dotenv/config';
import connectDb from "./config/connectDB.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoute from "./routes/authRoute.js";
import passport from "passport";
import './config/passport.js';
import requestsRoute from "./routes/requestsRoute.js";


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
app.use(passport.initialize());


app.use('/api/auth', authRoute)
app.use('/api/requests', requestsRoute)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDb();
});