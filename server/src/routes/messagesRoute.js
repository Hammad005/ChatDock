import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const messagesRoute = express.Router();

messagesRoute.use(protectRoute);

messagesRoute.get('/getMessages/:id', getMessages);
messagesRoute.post('/sendMessage/:id', sendMessage);

export default messagesRoute;