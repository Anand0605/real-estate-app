const Property = require('../models/Property');
const getDataUri = require('../utils/dataUri');
const cloudinary = require('cloudinary').v2;

// Create Property
exports.createProperty = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    let imageUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const result = await cloudinary.uploader.upload(fileUri.content);
      imageUrl = result.secure_url;
    }

    const property = new Property({
      title,
      description,
      price,
      image: imageUrl,
      createdBy: req.user.userId
    });

    await property.save();
    res.status(201).json({ message: "Property created", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('createdBy', 'username email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
