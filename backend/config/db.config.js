const mongoose = require("mongoose");
require("dotenv").config();

const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Server will continue without database connection");
  }
}

module.exports = dbConfig;