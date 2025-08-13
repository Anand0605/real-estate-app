import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import mongoose from "mongoose";

dotenv.config();
const app = express();
connectDB();

app.use(express.json());

// ✅ Test Schema
const TestSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});
const TestModel = mongoose.model("Test", TestSchema);

// ✅ POST route - Add test data
app.post("/add-test", async (req, res) => {
  try {
    const doc = await TestModel.create({ name: req.body.name });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET route - Fetch all test data
app.get("/get-test", async (req, res) => {
  try {
    const docs = await TestModel.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
