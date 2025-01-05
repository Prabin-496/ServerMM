import express from 'express';
import User from '../models/User.js';  // Import the User model

const router = express.Router();

// Route to check if a user exists by email
router.get('/users', async (req, res) => {
  const { email } = req.query; // Query parameter to get email
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Error checking user' });
  }
});

// Route to create a new user
// Modify the existing user creation route (no admin restriction)
router.post('/users', async (req, res) => {
  const { email, phoneNumber, role = 'user' } = req.body;

  
  try {
    // Check if the email already exists in the database
    const session = await mongoose.startSession();
    session.startTransaction();
    
    // Check if user exists, otherwise create a new one
    let user = await User.findOne({ email }).session(session);
    if (!user) {
      user = new User({ email, phoneNumber, role: 'user' });
      await user.save({ session });
    }
    
    // Create the contact submission
    const contactSubmission = new ContactSubmission({
      name,
      email,
      phoneNumber,
      messageTitle,
      message,
      userId: user._id,
    });
    
    await contactSubmission.save({ session });
    
    // Commit transaction
    await session.commitTransaction();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});


export default router;
