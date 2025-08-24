import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
    try {
        const myId = req.user._id;

        const sendedMessages = await Message.find({ senderId: myId });
        const receivedMessages = await Message.find({ receiverId: myId });
        res.status(200).json({ success: true, sendedMessages, receivedMessages });
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, images, files } = req.body;

        const { id: receiverId } = req.params;
        const myId = req.user._id;

        let uploadedImages = [];

        if (images && images.length > 0) {
            for (const image of images) {
                const cloudinaryResponse = await cloudinary.uploader.upload(image, {
                    folder: "ChatDock/messages/images",
                });

                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    throw new Error(cloudinaryResponse.error || "Unknown Cloudinary Error");
                }

                uploadedImages.push({
                    imageId: cloudinaryResponse.public_id,
                    imageUrl: cloudinaryResponse.secure_url,
                });
            }
        }

        let uploadedFiles = [];

        if (files && files.length > 0) {
            for (const file of files) {
                const cloudinaryResponse = await cloudinary.uploader.upload(file?.fileData,
                    {
                        folder: "ChatDock/messages/files",
                        resource_type: "auto",
                    });

                if (!cloudinaryResponse || cloudinaryResponse.error) {
                    throw new Error(cloudinaryResponse.error || "Unknown Cloudinary Error");
                }

                uploadedFiles.push({
                    fileId: cloudinaryResponse.public_id,
                    fileUrl: cloudinaryResponse.secure_url,
                    fileName: file?.fileName,
                });
            }
        }

        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
            images: uploadedImages,
            files: uploadedFiles
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(myId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                message: newMessage
            });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", {
                message: newMessage
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const markAsSeen = async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Message.findById(id);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        message.seen = true;
        await message.save();
        res.status(200).json({seendMessage: id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark message as seen" });
    }
};