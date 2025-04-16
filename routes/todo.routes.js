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
    res.send(todo);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Add DELETE endpoint to remove a todo by ID
todoRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to delete todo with id: ${id}`); // Debug log
    const deletedTodo = await TodoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).send({ message: "Todo not found" });
    }
    res.send({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(`Error deleting todo: ${error.message}`); // Debug log
    res.status(400).send({ message: error.message });
  }
});

module.exports = { todoRouter };
