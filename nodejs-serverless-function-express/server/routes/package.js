import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import Package from '../models/Package.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'trek_packages',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => file.originalname.split('.')[0],
  },
});

const upload = multer({ storage });
// Route to get all packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});
// Add this new route to get package by slug
router.get('/packages/slug/:slug', async (req, res) => {
  try {
    const trekPackage = await Package.findOne({ slug: req.params.slug });
    if (!trekPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json(trekPackage);
  } catch (err) {
    console.error('Error retrieving package:', err);
    res.status(500).json({ message: 'Error retrieving package', error: err.message });
  }
});

// Modify the create package route to handle slug generation
router.post('/packages', upload.array('images', 20), async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Uploaded Files:', req.files);

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    // Generate slug from title if not provided
    const slug = req.body.slug || req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists
    const existingPackage = await Package.findOne({ slug });
    if (existingPackage) {
      return res.status(400).json({ message: 'A package with this slug already exists' });
    }

    const overallImages = req.files.slice(0, 5).map(file => file.path);
    const itinerary = JSON.parse(req.body.itinerary || '[]').map((day, index) => ({
      ...day,
      imageUrl: req.files[5 + index] ? req.files[5 + index].path : null,
    }));

    const newPackage = new Package({
      slug,
      title: req.body.title,
      description: req.body.description,
      country: req.body.country,
      region: req.body.region,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      dailyDistance: req.body.dailyDistance,
      dailyAscent: req.body.dailyAscent,
      overallImages: overallImages,
      itinerary: itinerary,
      included: req.body.included.split(','),
      excluded: req.body.excluded.split(','),
      price: req.body.price,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (err) {
    console.error('Error saving package:', err.stack);
    return res.status(500).json({ message: 'Failed to upload package', error: err.message });
  }
});

// Update the PUT route to handle slug updates
router.put('/packages/:slug', upload.array('images', 20), async (req, res) => {
  const { slug } = req.params;

  try {
    let newSlug = req.body.slug;
    if (newSlug && newSlug !== slug) {
      // Check if new slug already exists
      const existingPackage = await Package.findOne({ slug: newSlug });
      if (existingPackage) {
        return res.status(400).json({ message: 'A package with this slug already exists' });
      }
    }

    const updatedData = {
      title: req.body.title,
      description: req.body.description,
      country: req.body.country,
      region: req.body.region,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      dailyDistance: req.body.dailyDistance,
      dailyAscent: req.body.dailyAscent,
      price: req.body.price,
      included: req.body.included.split(','),
      excluded: req.body.excluded.split(','),
      slug: newSlug || undefined // Only update slug if provided
    };

    if (req.files?.length) {
      updatedData.overallImages = req.files.slice(0, 5).map(file => file.path);
      updatedData.itinerary = JSON.parse(req.body.itinerary || '[]').map((day, index) => ({
        ...day,
        imageUrl: req.files[5 + index] ? req.files[5 + index].path : null,
      }));
    }

    const updatedPackage = await Package.findOneAndUpdate(
      { slug },
      updatedData,
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json(updatedPackage);
  } catch (err) {
    console.error('Error updating package:', err);
    res.status(500).json({ message: 'Failed to update package', error: err.message });
  }
});

// Update the DELETE route to use slug
router.delete('/packages/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const deletedPackage = await Package.findOneAndDelete({ slug });
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (err) {
    console.error('Error deleting package:', err);
    res.status(500).json({ message: 'Failed to delete package', error: err.message });
  }
});

export default router;
