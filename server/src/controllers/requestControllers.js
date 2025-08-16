import { io } from "../lib/socket.js";
import Request from "../models/Request.js";
import User from "../models/User.js";

export const getMyRequests = async (req, res) => {
    try {
        const receivedRequests = await Request.find({ requestReceiver: req.user._id });
        const sentRequests = await Request.find({ requestSender: req.user._id });
        res.status(200).json({
            receivedRequests,
            sentRequests
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const sendRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const exists = await Request.findOne({ requestSender: req.user._id, requestReceiver: id });
        if (exists) {
            return res.status(400).json({ error: "You have already sent a request to this user" });
        };
        const request = await Request.create({ requestSender: req.user._id, requestReceiver: id });

        io.emit("newRequest", request);
        res.status(200).json({
            request
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const acceptRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Request.findById(id);
        if (req.user._id.toString() !== request.requestReceiver.toString()) {
            return res.status(401).json({ error: "Unauthorized, You can't accept this request" });
        };
        request.status = "accepted";
        await request.save();

        const receiver = await User.findById(req.user._id).select("-password");
        receiver.friends.push(request.requestSender._id);
        await receiver.save();

        const sender = await User.findById(request.requestSender._id).select("-password");
        sender.friends.push(req.user._id);
        await sender.save();

        const receivedRequests = await Request.find({ requestReceiver: req.user._id });
        const sentRequests = await Request.find({ requestSender: req.user._id });
        res.status(200).json({
            receivedRequests,
            sentRequests,
            senderFriend: receiver._id,
            receiverFriend: sender._id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const rejectRequest = async (req, res) => {
    const { id } = req.params;
    try {
         await Request.findByIdAndDelete(id);
        const receivedRequests = await Request.find({ requestReceiver: req.user._id });
        const sentRequests = await Request.find({ requestSender: req.user._id });

        io.emit("rejectRequest", {
            sentRequests,
            receivedRequests
        });
        res.status(200).json({
            receivedRequests,
            sentRequests
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const removeFriend = async (req, res) => {
    const { id } = req.params;
    try {

        const user = await User.findById(req.user._id).select("-password");
        user.friends = user.friends.filter(friend => friend.toString() !== id);
        await user.save();

        const otherUser = await User.findById(id).select("-password");
        if (otherUser?.friends) {
            otherUser.friends = otherUser.friends.filter(friend => friend.toString() !== req.user._id.toString());
            await otherUser.save();
        }


        await Request.findOneAndRemove({ requestSender: req.user._id, requestReceiver: id });
        await Request.findOneAndRemove({ requestSender: id, requestReceiver: req.user._id });

        const receivedRequests = await Request.find({ requestReceiver: req.user._id });
        const sentRequests = await Request.find({ requestSender: req.user._id });
        res.status(200).json({
            receivedRequests,
            sentRequests,
            removedFriend: id
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}