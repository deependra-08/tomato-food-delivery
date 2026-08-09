import express from "express";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import { connectDB } from "./config/db.js";
import dns from 'dns';
import foodRouter from "./routes/food.route.js";
import userRouter from "./routes/user.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";

dns.setServers(["1.1.1.1","8.8.8.8"]);

// "uploads" is gitignored, so it won't exist on a fresh clone.
// Multer will throw ENOENT trying to save images without it.
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/api/food",foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

app.get("/", (req, res) => {
    res.send("API WORKING");
});

const startServer = async () => {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
};

startServer();