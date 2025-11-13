import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./model/userModel.js";

// dotenv.config();

const app = express();
const router = express.Router();

const PORT =  3000;
const SECRET_KEY = 18/12/2002;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose
  .connect('mongodb+srv://kabz:18122002kabera@cluster0.jjuem2u.mongodb.net/?appName=Cluster0&retryWrites=true&w=majority')
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

   })
  .catch((err) => console.error(" MongoDB connection error:", err));

  app.use("/", router);

// Test route
router.get("/", (req, res) => {
  res.send("Hello World");
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected route
router.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    res.json({ message: "Access granted", user });
  });
});

