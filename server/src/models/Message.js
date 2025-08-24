import mongoose from 'mongoose';

const messageScheema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
        },
        images: [{
            imageId: {
                type: String,
            },
            imageUrl: {
                type: String,
            }
        }],
        files: [{
            fileId: {
                type: String,
            },
            fileUrl: {
                type: String,
            },
            fileName: {
                type: String,
            },
        }],
        seen:{
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageScheema);
export default Message;