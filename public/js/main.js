const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Accessing environment variables
const urlDB = process.env.MONGODB_URL;
const connectionString = process.env.LOCAL_MONGODB_URL; // Use this to store locally

async function connect_to_mongodb() {
  try {
    await mongoose.connect(connectionString);
    console.info("Connected to MongoDB");
    return 200; // Return success status code
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return 404; // Return error status code
  }
}

module.exports = { connect_to_mongodb };

