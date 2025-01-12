import Blog from "../models/Blog.js";
import slugify from "slugify";

const createNewBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required!" });
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Image URL from Cloudinary
    const imageUrl = req.file.path;

    const blogPost = new Blog({
      title,
      slug,
      content,
      image: imageUrl,
    });

    await blogPost.save();
    res
      .status(201)
      .json({ message: "Blog post created successfully", blogPost });
  } catch (error) {
    console.error("Error creating blog post:", error);
    res
      .status(500)
      .json({ message: "Failed to create blog. Please try again." });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error retrieving blog post:", error);
    res.status(500).json({ message: "Failed to retrieve blog post" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const blogId = req.params.id;

    const updatedData = { title, content };

    // If an image is provided, update the image URL
    if (req.file) {
      updatedData.image = req.file.path;
    }

    // If title is updated, regenerate the slug
    if (title) {
      updatedData.slug = slugify(title, { lower: true, strict: true });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res
      .status(200)
      .json({ message: "Blog post updated successfully", updatedBlog });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ message: "Failed to update blog post" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
};

export { 
    createNewBlog,
    getAllBlogs, 
    getBlogBySlug, 
    updateBlog, 
    deleteBlog 
};
