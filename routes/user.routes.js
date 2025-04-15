const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) return res.status(400).send({ message: err.message });
      if (hash) {
        const user = new UserModel({ fullName, email, password: hash });
        await user.save();
        res.send({ message: "successfull registered" });
      }
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  try {
    // Find user by email
    const user = await UserModel.findOne({ email });

    // If user doesn't exist, return error
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password with hashed password in database
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        // If password doesn't match, return error
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
      if (result) {
        // Create token payload
        const payload = {
          userId: user._id,
        };

        // Set token expiration based on rememberMe
        const expiresIn = rememberMe ? "7d" : "24h";

        // Generate JWT token
        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET || "secret-key",
          {
            expiresIn,
          }
        );

        // Return success response with token and user info (excluding password)
        const userWithoutPassword = {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          // Add any other user properties you want to send to frontend
        };

        res.status(200).json({
          message: "Login successful",
          token,
          user: userWithoutPassword,
        });
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred during login process",
      error: error.message,
    });
  }
});

module.exports = { userRouter };
