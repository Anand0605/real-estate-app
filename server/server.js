import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"; 
import mongoose from "mongoose";

// Import your route files
import authRoutes from "./src/routes/auth.routes.js";

import propertyRoutes from "./src/routes/property.routes.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Register your routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// Test routes (optional)
const TestSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});
const TestModel = mongoose.model("Test", TestSchema);

app.post("/add-test", async (req, res) => {
  try {
    const doc = await TestModel.create({ name: req.body.name });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-test", async (req, res) => {
  try {
    const docs = await TestModel.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
