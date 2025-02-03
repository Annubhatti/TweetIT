const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () =>{
await mongoose
  .connect(mongoUri,{
    useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduce timeout time
      connectTimeoutMS: 10000, // 10s timeout
      keepAlive: true,
      keepAliveInitialDelay: 300000,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => console.log("Error connected to the Databse", error));

};

module.exports = {initializeDatabase};