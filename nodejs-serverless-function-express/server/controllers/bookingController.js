import Booking from "../models/Booking.js";
import { sendBookingEmails } from "../utils/email.js";

const createNewBooking = async (req, res) => {
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

    // Send emails
    await sendBookingEmails(formData, packageData, numberOfPeople, date);

    res.status(200).json({
      success: true,
      message: "Booking successful and confirmation email sent",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred during booking" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching bookings",
    });
  }
};

export { getAllBookings, createNewBooking };
