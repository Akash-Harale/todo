const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/users", (req, res) => {
  res.send("These are all users present in database");
});
const server = app.listen(PORT);

server.on("error", (err) => {
  console.log(`failed to start the server ${err.message}`);
});
