const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { todoRouter } = require("./routes/todo.routes");
const { auth } = require("./middlewares/auth.middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middlwares
app.use(express.json());
app.use(cors());
// Routes
// user routes
app.use("/user", userRouter);

// auth middleware
app.use(auth);

// todo routes
app.use("/todo", todoRouter);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  try {
    await connection;
    console.log("successfully connected to database");
  } catch (error) {
    console.log(error.message);
  }
});

server.on("error", (err) => {
  console.log(`failed to start the server ${err.message}`);
});
