// routes/user.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const cookieParser = require("cookie-parser");
const User = require("../models/User");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
router.use(cookieParser());

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const validPassword = await user.comparePassword(password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    // Set the JWT token as a cookie
    res.cookie("token", token, {
      httpOnly: false,
      signed: true,
      sameSite: "Strict",
      secure: false,
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
