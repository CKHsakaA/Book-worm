import express from 'express';
import cors from 'cors';
import dotenv from "dotenv"
import { connectDB } from './config/db.js';
import booksRoutes from "./src/routes/books.router.js"
import authRoutes from "./src/routes/auth.route.js"
import cookieParser from 'cookie-parser';
import ratingRoutes from "./src/routes/ratings.route.js"


dotenv.config();
const app = express();
const port = 3000; 

app.use(cors({  
  origin: "http://localhost:5173",
  credentials: true                
})); 
app.use(cookieParser());
app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ratings", ratingRoutes)
// app.use("api/ratings", ratingRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server running at http://localhost:${port}`);
});

// Ecpn8VWHErr5Ddoe