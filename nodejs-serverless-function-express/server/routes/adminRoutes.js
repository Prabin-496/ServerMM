import express from "express";
import { adminLogin, adminSetup } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminLogin); // Admin login endpoint
router.post("/setup-admin", adminSetup); // Create initial admin user

export default router;
