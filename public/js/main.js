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

function generate_session_id() {
  // not yet properly implemented
  const sessionID = "29109203474908adjgcb233123";
  if (sessionID != null) {
    return 200;
  } else {
    return 402;
  }
}

module.exports = { connect_to_mongodb, generate_session_id };
