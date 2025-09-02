import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_CALLBACK_URL);
export const googleAuth = async (req, res) => {
    const { code } = req.body;
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // contains Google profile
    const { sub: googleId, name, email, picture } = payload;

    // 3. Check if user exists
    let user = await User.findOne({ googleId });

    if (user) {
        // Case 1: Profile pic is updated manually → don’t overwrite
        if (user.profilePic?.isUpdated) {
            user.email = email;
        } else {
            // Case 2: Profile not updated → update image + email
            user.email = email;
            user.profilePic = {
                imageId: null,
                imageUrl: picture,
                isUpdated: false,
            };
        }

        await user.save();
    } else {
        // Case 3: No user exists → create new
        user = await User.create({
            googleId,
            fullName: name,
            email,
            profilePic: {
                imageId: null,
                imageUrl: picture,
                isUpdated: false,
            },
        });
    };

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
};

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

export const updateProfile = async (req, res) => {
    const { fullName, about, profilePic } = req.body
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
                    about,
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
                    about
                },
                { new: true }
            );
        }

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found after update" });
        }

        const userWithoutPassword = { ...updatedUser._doc };
        delete userWithoutPassword.password;

        io.emit("updateProfile", userWithoutPassword);

        return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const removeProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user?.profilePic?.imageId) {
            await cloudinary.uploader.destroy(user.profilePic.imageId);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                profilePic: {
                    imageId: null,
                    imageUrl: null,
                    isUpdated: true
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found after update" });
        }

        const userWithoutPassword = { ...updatedUser._doc };
        delete userWithoutPassword.password;

        io.emit("updateProfile", userWithoutPassword);
        return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: { $nin: req.user._id },
        }).select("-password").sort({ createdAt: -1 });
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
}