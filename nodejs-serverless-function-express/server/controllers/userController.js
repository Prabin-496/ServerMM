import User from '../models/User.js';
import ContactSubmission from '../models/ContactSubmission.js';

// Function to check if a user exists by email
const getUserByEmail = async (req, res) => {
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
}

const createUser = async (req, res) => {
  const { email, phoneNumber, name, messageTitle, message } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, phoneNumber, role: 'user' });
      await user.save(); 
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

    await contactSubmission.save(); 

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }

}

export { 
  getUserByEmail, 
  createUser
 };