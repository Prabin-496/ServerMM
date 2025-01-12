// creating router with the help of express 
import express from 'express';
import { 
    getUserByEmail,
    createUser,
 } from "../controllers/userController.js";
const router = express.Router();

//Routes for user actions

router.get("/users", getUserByEmail) // Route to check if a user exits by email
router.post("/users", createUser); // Route to create a new user // Modify the existing user creation route (no admin restriction)

export default router;
