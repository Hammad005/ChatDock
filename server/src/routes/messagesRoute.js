import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMessages, markAsSeen, sendMessage } from "../controllers/messageController.js";

const messagesRoute = express.Router();

messagesRoute.use(protectRoute);

messagesRoute.get('/getMessages', getMessages);
messagesRoute.post('/sendMessage/:id', sendMessage);
messagesRoute.put('/markAsSeen/:id', markAsSeen);

export default messagesRoute;