import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: ""
    },
    otpExpires: {
        type: Date
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpires: {
        type: Date
    }
},{minimize:false,timestamps:true})

export const User = mongoose.model("User",userSchema)