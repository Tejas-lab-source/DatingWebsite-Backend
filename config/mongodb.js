const mongoose = require('mongoose');
const  connectDB = async () => {
  try {
    const dbUrl = process.env.MONGODB_URL;
    if (!dbUrl) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
module.exports = connectDB;