import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req,res) =>{

    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

    try {
        const newOrder = new Order({
            userid: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })

    await newOrder.save();
    await User.findByIdAndUpdate(req.body.userId,{cartData:{}});

    const line_items = req.body.items.map((item)=>({
        price_data:{
            currency: "usd",
            product_data:{
                name:item.name
            },
            unit_amount: Math.round(item.price * 100)
        },
        quantity: item.quantity
    }))

    line_items.push({
        price_data:{
            currency:"usd",
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount: 200 // $2.00
        },
        quantity: 1
    })

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

    })

    res.json({success:true,session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) =>{
    const {orderId, success} = req.body;
    try {
        if(success=="true"){
            await Order.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"paid"});
        }

        else{
            await Order.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const userOrders = async (req,res)=>{
    try {
        // Only show orders that were actually paid for. An order document
        // is created *before* Stripe checkout completes, so if the user
        // cancels or never finishes payment (e.g. closes the tab), it
        // should not appear as if it was placed.
        const orders = await Order.find({userid:req.body.userId, payment:true});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const listOrders = async (req,res)=>{
    try {
        const orders = await Order.find({payment:true});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const updateStatus = async (req,res)=>{
    try {
        await Order.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Get single order for Live Tracking
const getOrderTrackDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching order details" });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, getOrderTrackDetails };