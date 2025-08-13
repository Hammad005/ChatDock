import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requestSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["sending", "accepted"],
        default: "sending"
    }
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);
export default Request