import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { acceptRequest, getMyRequests, rejectRequest, removeFriend, sendRequest } from "../controllers/requestControllers.js";

const requestsRoute = express.Router();

requestsRoute.use(protectRoute);

requestsRoute.get('/getMyRequests', getMyRequests);

requestsRoute.post('/sendRequest/:id', sendRequest);

requestsRoute.put('/acceptRequest/:id', acceptRequest);

requestsRoute.delete('/rejectRequest/:id', rejectRequest);
requestsRoute.delete('/removeFriend/:id', removeFriend);


export default requestsRoute