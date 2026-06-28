import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import User from "./backend/models/users.model.js";  // adjust path if needed

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importUsers = async () => {
  await connectDB();

  const users = [];

  fs.createReadStream("./data/Users.csv")  // path to your CSV
    .pipe(csv())
    .on("data", (row) => {
    users.push({
      userid: row.user_id,
      userlocation: row.location,
      age: row.age? row.age : null,
      cart : [],
    });  
    })
    .on("end", async () => {
      try {
        await User.insertMany(users);
        console.log(`✅ Imported ${users.length} users`);
        mongoose.connection.close();
      } catch (error) {
        console.error(`Error importing users: ${error.message}`);
      }
    });
};

importUsers();