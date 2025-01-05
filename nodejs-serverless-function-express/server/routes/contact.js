import express from 'express';
import ContactSubmission from '../models/ContactSubmission.js';
import User from '../models/User.js';
import process from 'process';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails to both customer and admin
const sendContactFormEmails = (contactDetails) => {
  // Email content for the customer
  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: contactDetails.email,
    subject: 'Thank you for contacting Mantra Mountain',
    html: `
      <p>Dear ${contactDetails.name},</p>
      <p>Thank you for reaching out to us! We have received your message, and one of our team members will get back to you soon.</p>
      <p><strong>Your Message:</strong> ${contactDetails.message}</p>
      <p>Best regards,<br>Mantra Mountain</p>
    `,
  };

  // Email content for admin notification
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: 'prabinparajuli496@gmail.com',
    subject: 'New Contact Form Submission',
    html: `
      <p><strong>New Submission:</strong></p>
      <p><strong>Name:</strong> ${contactDetails.name}</p>
      <p><strong>Email:</strong> ${contactDetails.email}</p>
      <p><strong>Message:</strong> ${contactDetails.message}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      <p>Please respond to the customer as soon as possible.</p>
    `,
  };

  // Send emails
  return Promise.all([
    transporter.sendMail(customerMailOptions),
    transporter.sendMail(adminMailOptions)
  ]).catch(error => {
    console.error('Error sending emails:', error);
    // Continue with the submission even if email fails
  });
};

const router = express.Router();

// Submit contact form endpoint
router.post('/', async (req, res) => {
  let session;
  try {
    console.log('Received contact form submission:', req.body);
    const { name, email, phoneNumber, messageTitle, message } = req.body;

    // Enhanced validation
    if (!name?.trim() || !email?.trim() || !phoneNumber?.trim() || !messageTitle?.trim() || !message?.trim()) {
      console.log('Missing or empty required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required and cannot be empty' 
      });
    }

    // Create contact submission without transaction first for debugging
    const newContactSubmission = new ContactSubmission({
      name,
      email,
      phoneNumber,
      messageTitle,
      message,
      // Create a temporary ObjectId if user doesn't exist yet
      userId: new mongoose.Types.ObjectId()
    });

    // Basic save without transaction for testing
    const savedSubmission = await newContactSubmission.save();
    console.log('Contact submission saved:', savedSubmission);

    // Find or create user in separate operation
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        phoneNumber,
        role: 'user'
      });
      await user.save();
      
      // Update the submission with the correct userId
      savedSubmission.userId = user._id;
      await savedSubmission.save();
    }

    // Send emails (non-blocking)
    sendContactFormEmails({ name, email, message });

    res.status(200).json({ 
      success: true, 
      message: 'Contact form submission successful',
      submissionId: savedSubmission._id
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Send more detailed error information for debugging
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred during contact form submission',
      error: {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});

// Add a debug endpoint to verify database connection
router.get('/test-db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      dbStatus: states[dbState],
      connected: dbState === 1,
      models: {
        user: !!mongoose.models.User,
        contactSubmission: !!mongoose.models.ContactSubmission
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;