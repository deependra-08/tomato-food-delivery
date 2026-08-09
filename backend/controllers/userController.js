import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createaToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret_key");
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createaToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error logging in" });
    }
};

// Direct Account Registration
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.json({ success: false, message: "User with this email already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        if (!password || password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (at least 8 characters)" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isVerified: true
        });

        const user = await newUser.save();
        const token = createaToken(user._id);
        res.json({ success: true, token, message: "Account created successfully!" });

    } catch (error) {
        console.log("registerUser error:", error);
        res.json({ success: false, message: "Error creating user account" });
    }
};

export { 
    loginUser, 
    registerUser
};