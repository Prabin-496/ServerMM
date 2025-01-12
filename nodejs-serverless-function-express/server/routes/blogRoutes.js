import express from "express";
import { blogUpload } from "../utils/uploadUtils.js";
import {
  createNewBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/create", blogUpload.single("image"), createNewBlog); // Create a new blog post
router.get("/", getAllBlogs); // Get all blog posts
router.get("/slug/:slug", getBlogBySlug); // Get a blog post by slug
router.put("/update/:id", blogUpload.single("image"), updateBlog); // Update a blog post
router.delete("/delete/:id", deleteBlog); // Delete a blog post

export default router;
