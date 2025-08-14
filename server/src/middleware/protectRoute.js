import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    const token = req.cookies.ChatDockAuth
    if (!token) {
        return res.status(401).json({ error: "Unauthorized, Please login" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        try {
            const user = await User.findById(decoded.id).select("-password")
            if (!user) {
                return res.status(401).json({ error: "Unauthorized, Please login" });
            }

            req.user = user
            next()
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res
                    .status(401)
                    .json({ error: "Unauthorized - Access token expired" });
            }
            return res
                .status(500)
                .json({ error: error.message || "Internal server error" });
        }
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized, Please login" });
    }
};
