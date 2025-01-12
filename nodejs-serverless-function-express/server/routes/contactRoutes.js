import express from "express";
import { submitContact, testDB } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContact);// Submit contact form endpoint
router.get("/test-db", testDB);// Add a debug endpoint to verify database connection

export default router;
