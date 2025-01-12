import express from "express";
import { packageUpload } from "../utils/uploadUtils.js";
import {
  getAllPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

const router = express.Router();

router.get("/packages", getAllPackages); // Route to get all packages
router.get("/packages/slug/:slug", getPackageBySlug); // Add this new route to get package by slug
router.post("/packages", 
    packageUpload.array("images", 20), 
    createPackage
); // Modify the create package route to handle slug generation
router.put("/packages/:slug", 
    packageUpload.array("images", 20), 
    updatePackage
); // Update the PUT route to handle slug updates
router.delete("/packages/:slug", deletePackage); // Update the DELETE route to use slug

export default router;
