import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },

    items: {
        type: Array,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    address: {
        type: Object,
        required: true
    },

    status: {
        type: String,
        default: "Food Processing"
    },

    deliveryLocation: {
        type: Object,
        default: { lat: 28.6139, lng: 77.2090 } // Default center if not specified
    },

    driverDetails: {
        type: Object,
        default: {
            name: "Rahul Sharma",
            phone: "+91 98765 43210",
            vehicleNo: "MH 02 AB 1234",
            rating: 4.9,
            photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        }
    },

    estimatedTime: {
        type: Number,
        default: 25
    },

    date: {
        type: Date,
        default: Date.now()
    },

    payment: {
        type: Boolean,
        default: false
    },
})

export const Order = mongoose.model("Order",orderSchema);