import mongoose from "mongoose";
import ContactSubmission from "../models/ContactSubmission.js";
import User from "../models/User.js";
import { sendContactFormEmails }  from "../utils/email.js";

const submitContact = async (req, res) => {
  try {
    console.log("Received contact form submission:", req.body);
    const { name, email, phoneNumber, messageTitle, message } = req.body;

    // Enhanced validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phoneNumber?.trim() ||
      !messageTitle?.trim() ||
      !message?.trim()
    ) {
      console.log("Missing or empty required fields");
      return res.status(400).json({
        success: false,
        message: "All fields are required and cannot be empty",
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
      userId: new mongoose.Types.ObjectId(),
    });

    // Basic save without transaction for testing
    const savedSubmission = await newContactSubmission.save();
    console.log("Contact submission saved:", savedSubmission);

    // Find or create user in separate operation
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        phoneNumber,
        role: "user",
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
      message: "Contact form submission successful",
      submissionId: savedSubmission._id,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);

    // Send more detailed error information for debugging
    res.status(500).json({
      success: false,
      message: "An error occurred during contact form submission",
      error: {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    });
  }
};

const testDB = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      dbStatus: states[dbState],
      connected: dbState === 1,
      models: {
        user: !!mongoose.models.User,
        contactSubmission: !!mongoose.models.ContactSubmission,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { submitContact, testDB };