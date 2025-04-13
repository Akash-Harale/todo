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
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(400).send({ message: err.message });
        if (result) {
          res.send({
            message: "Login Successful",
            token: jwt.sign({ userId: user._id }, "secret-key"),
          });
        }
      });
    }
  } catch (error) {
    res.send({ message: `Inside the catch block ${error.message}` });
  }
});

module.exports = { userRouter };
