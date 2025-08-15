import express from "express";
import multer from "multer";
import { cloudinary } from "../config/cloudnery.js"; // tumhare require wale file ka ES import version
import Property from "../models/Property.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Multer setup — store in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Add property with image
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // File ko buffer se base64 me convert karo
    const b64 = req.file.buffer.toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Cloudinary pe upload
    const cloudRes = await cloudinary.uploader.upload(dataURI, {
      folder: "real_estate_properties"
    });

    // Property create
    const property = await Property.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: cloudRes.secure_url, // Cloudinary URL
      owner: req.user.id
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email");
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
