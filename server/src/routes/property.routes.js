import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import getDataUri from '../utils/dataUri.js';
import Property from '../models/Property.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add property with image
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const file = getDataUri(req.file);
    const cloudRes = await cloudinary.uploader.upload(file.content);

    const property = await Property.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: cloudRes.secure_url,
      owner: req.user.id
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all properties
router.get('/', async (req, res) => {
  const properties = await Property.find().populate('owner', 'name email');
  res.json(properties);
});

export default router;
