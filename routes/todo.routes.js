const express = require("express");
const { TodoModel } = require("../models/todo.model");

const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.send(todos);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

todoRouter.post("/add", async (req, res) => {
  try {
    const todo = new TodoModel(req.body);
    await todo.save();
    res.send({ message: "A new Todo has been added" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = { todoRouter };
