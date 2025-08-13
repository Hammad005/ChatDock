import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true // to allow null value
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  about: {
    type: String,
    default: null
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters"],
  },
  profilePic: {
    imageId: {
      type: String,
      default: null
    },
    imageUrl: {
      type: String,
      default: null
    },
    isUpdated: {
      type: Boolean,
      default: false
    },
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: []
    }
  ]
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User