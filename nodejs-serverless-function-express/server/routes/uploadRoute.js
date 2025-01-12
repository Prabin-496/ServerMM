import express from 'express';
import upload from '../middleware/multer.middleware.js';
import { uploadFile } from "../controllers/uploadController.js";
const router = express.Router();

router.post('/upload', upload.single('image'), uploadFile);

export default router;