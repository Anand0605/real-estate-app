import express from "express";
import dotenv from "dotenv";
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
