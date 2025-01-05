import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  dailyDistance: {
    type: String,
    required: true,
  },
  dailyAscent: {
    type: String,
    required: true,
  },
  overallImages: [
    {
      type: String, // Cloudinary URLs
    }
  ],
  itinerary: [
    {
      day: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String, // Cloudinary URL for the image of each day
      },
      duration: {
        type: String,
        required: true,
      },
      distance: {
        type: String,
        required: true,
      },
      ascent: {
        type: String,
        required: true,
      },
      descent: {
        type: String,
        required: true,
      }
    }
  ],
  included: [String],  // List of what's included
  excluded: [String],  // List of what's excluded
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Package', packageSchema);
