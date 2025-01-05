import express from 'express';
import nodemailer from 'nodemailer';
import Booking from '../models/booking.js';

const router = express.Router();

// Email configuration
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { packageData, date, formData, numberOfPeople } = req.body;

    // Save booking to MongoDB
    const newBooking = new Booking({
      packageName: packageData.packageName,
      bookingDate: new Date(date),
      customerName: formData.name,
      customerEmail: formData.email,
      contactNumber: formData.contactNumber,
      numberOfPeople: numberOfPeople,
    });
    await newBooking.save();

    // Send confirmation email to customer
    const confirmationEmailOptions = {
      from: 'Mantra Mountain <info@mantramountain.com>',
      replyTo: 'info@mantramountain.com',
      to: formData.email,
      subject: 'Booking Confirmation - Mantra Mountain',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4a4a4a;">Booking Confirmation</h1>
            <p>Dear ${formData.name},</p>
            <p>Thank you for booking <strong>${packageData.packageName}</strong> for <strong>${date}</strong>.</p>
            <p>Number of people: <strong>${numberOfPeople}</strong></p>
            <p>Your booking has been confirmed. We look forward to providing you with an unforgettable experience.</p>
            <p>Best regards,</p>
            <p>Mantra Mountain Team</p>
          </body>
        </html>
      `
    };

    await transporter.sendMail(confirmationEmailOptions);

    // Send notification email to admin
    const notificationEmailOptions = {
      from: 'Mantra Mountain Booking System <info@mantramountain.com>',
      replyTo: 'info@mantramountain.com',
      to: 'prabinparajuli496@gmail.com, info@mantramountain.com',
      subject: 'New Booking Received - Mantra Mountain',
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4a4a4a;">New Booking Received</h2>
            <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Package:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${packageData.packageName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${formData.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${formData.email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Contact Number:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${formData.contactNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Number of People:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${numberOfPeople}</td>
              </tr>
            </table>
            
            <h3 style="color: #4a4a4a; margin-top: 20px;">Customer Message</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${formData.message || 'No message provided'}</p>
            
            <p style="font-size: 0.9em; color: #888; margin-top: 30px;">This is an automated message from the Mantra Mountain Booking System.</p>
          </body>
        </html>
      `
    };

    await transporter.sendMail(notificationEmailOptions);

    res.status(200).json({ success: true, message: 'Booking successful and confirmation email sent' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'An error occurred during booking' });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, message: 'An error occurred while fetching bookings' });
  }
});

export default router;