import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";   // mongo express react node
import dotenv from "dotenv";
import Book from "./backend/models/books.model.js";  // adjust path if needed

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

const importBooks = async () => {
  await connectDB();

  const books = [];

  fs.createReadStream("./data/Books(1).csv")  // path to your CSV
    .pipe(csv())
    .on("data", (row) => {
    books.push({
      ibsn: row.isbn,
      bktitle: row.title,
      author: row.author,
      yop: row.year,
      publisher: row.publisher,
      img: row.img_l || undefined,
    });  
    })
    .on("end", async () => {
      try {
        await Book.insertMany(books);
        console.log(`✅ Imported ${books.length} books`);
        mongoose.connection.close();
      } catch (error) {
        console.error(`Error importing books: ${error.message}`);
      }
    });
};

importBooks();
