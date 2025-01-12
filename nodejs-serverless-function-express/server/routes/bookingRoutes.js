import express from 'express';
import { getAllBookings, createNewBooking } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createNewBooking);// Create new booking
router.get('/', getAllBookings);// Get all bookings

export default router;