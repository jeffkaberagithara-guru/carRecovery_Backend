import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
const PORT = process.env.PORT || 3000;
const app=express();
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
})




app.get("/", (req, res) => {
    res.send("Hello World");
})







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`);
})