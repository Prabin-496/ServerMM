import User from "../models/User.js";
import jwt from "jsonwebtoken";

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the user from the database by email and include the password field
    const user = await User.findOne({ email }).select("+password"); // Include password explicitly

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If login is successful, generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "your-secret-key", // Make sure to use a secret from an environment variable
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

const adminSetup = async (req, res) => {
  try {
    // Check if setup is allowed (you might want to disable this in production)
    if (
      process.env.NODE_ENV === "production" && !process.env.ALLOW_ADMIN_SETUP
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin setup is not allowed in production",
      });
    }

    const { email, password, setupKey } = req.body;

    // Verify setup key
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(401).json({
        success: false,
        message: "Invalid setup key",
      });
    }

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists",
      });
    }

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email,
      password, // Password will be hashed by the pre-save hook in User model
      role: "admin",
      isVerified: true,
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
    });
  } catch (error) {
    console.error("Error in admin setup:", error);
    res.status(500).json({
      success: false,
      message: "Error creating admin user",
    });
  }
};

export { 
    adminLogin, 
    adminSetup
 };