import mongoose from 'mongoose';
import slugify from 'slugify';
import dotenv from 'dotenv';  
dotenv.config();

// Blog Schema definition
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'], // Ensure title is always provided
  },
  slug: {
    type: String,
    unique: true, // Ensure the slug is unique
    // required: [true, 'Slug is required'], // Ensure the slug is always provided
  },
  content: {
    type: String,
    required: [true, 'Content is required'], // Content cannot be empty
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'], // Ensure an image is always provided
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date if not provided
  },
});

// Pre-save hook to automatically generate slug from title
blogSchema.pre('save', function (next) {
  // Check if the slug exists, to avoid overwriting an existing slug
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true }); // Slugify the title
  }
  next(); // Continue with the save operation
});

// Model creation
const Blog = mongoose.model('Blog', blogSchema);

// Export the Blog model
export default Blog;
