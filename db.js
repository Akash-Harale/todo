const mongoose = require("mongoose");
require("dotenv").config();

const mongodbUrl = process.env.MONGODB_URL;

const connection = mongoose.connect(mongodbUrl);

module.exports = { connection };
