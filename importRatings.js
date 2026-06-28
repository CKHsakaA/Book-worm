import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import Rating from "./backend/models/ratings.model.js";  // adjust path if needed

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

const importRatings = async () => {
  await connectDB();

  const ratings = [];

  fs.createReadStream("./data/Ratings.csv")  // path to your CSV
    .pipe(csv())
    .on("data", (row) => {
    ratings.push({
      bookid: row.isbn,
      ratedby: row.user_id,
      rating: row.rating !== 0 ? row.rating : null,
    });  
    })
    .on("end", async () => {
      try {
        await Rating.insertMany(ratings);
        console.log(`✅ Imported ${ratings.length} ratings`);
        mongoose.connection.close();
      } catch (error) {
        console.error(`Error importing books: ${error.message}`);
      }
    });
};

importRatings();
