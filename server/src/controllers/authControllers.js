import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: `${!fullName ? "fullName is required" : !email ? "email is required" : "password is required"}` })
        } else if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" })
        }

        const user = await User.create({
            fullName,
            email,
            password
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5d"
        });

        const userWithoutPassword = { ...user._doc }
        delete userWithoutPassword.password

        res.cookie("ChatDockAuth", token, {
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
            secure: process.env.NODE_ENV === "production",
        })
            .status(201)
            .json({ user: userWithoutPassword })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: `${!email ? "email is required" : "password is required"}` });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(404).json({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;

        res.cookie("ChatDockAuth", token, {
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
            secure: process.env.NODE_ENV === "production",
        })
            .status(200)
            .json({ user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("ChatDockAuth", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const sendToken = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5d",
    });

    res.cookie("ChatDockAuth", token, {
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
        secure: process.env.NODE_ENV === "production",
    })
        .status(200)
        .redirect(process.env.CLIENT_URL);
};

export const updateProfile = async (req, res) => {
    const { fullName, profilePic } = req.body
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let updatedUser;

        if (profilePic) {
            if (user?.profilePic?.imageId) {
                await cloudinary.uploader.destroy(user.profilePic.imageId);
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(profilePic, {
                folder: "ChatDock/profilePics",
            });
            if (!cloudinaryResponse || cloudinaryResponse.error) {
                throw new Error(cloudinaryResponse.error || "Unknown Cloudinary Error");
            }

            updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    fullName,
                    profilePic: {
                        imageId: cloudinaryResponse.public_id,
                        imageUrl: cloudinaryResponse.secure_url,
                        isUpdated: true
                    },
                },
                { new: true }
            );
        } else {
            updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                {
                    fullName,
                },
                { new: true }
            );
        }

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found after update" });
        }

        const userWithoutPassword = { ...updatedUser._doc };
        delete userWithoutPassword.password;

        return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};